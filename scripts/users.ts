import {createConnection, getConnection} from 'typeorm';
import {User, UserRole} from '../src/entity/user';
import {PasswordLink} from '../src/entity/passwordlink';
import {hashPassword} from '../crypt';
import {v4 as uuid} from 'uuid';


/**
 * Generates donnor users with desired count and uses the provided users
 * as advisors assigning them on random.
 */
const generateUsers = (count:number = 50):User[] => {
  let i = 0;
  const users = [];
  while (i < count) {
    i++;
    let user: User = new User();
    user.email = `testdonnor${i}@test.com`;
    user.firstname = `DonnorName${i}`;
    user.lastname = `DonnorSurname${i}`;
    user.role = UserRole.DONOR;
    user.cid = `CustomerId${i}`;
    users.push(user);
  }
  return users;
}

/**
 * Generate advisors to fill in the DB for QA tests.
 */
const generateAdvisors = (count:number = 10):User[] => {
  let i = 0;
  const users = [];

  while (i < count) {
    i++;
    const user: User = new User();
    user.email = `testadvisor${i}@test.com`;
    user.firstname = `Advisor${i}`;
    user.lastname = `AdvisorSurname${i}`;
    user.role = UserRole.ADVISOR;
    user.password = `password${i}`;
    users.push(user);
  }

  // Add developer's test user.
  const peter = new User();
  peter.email = 'peterj@mail.bg';
  peter.password = '123456';
  peter.firstname = 'Peter';
  peter.lastname = 'StJ';
  peter.role = UserRole.ADVISOR;
  users.push(peter);

  return users;
}

const saveUsers = (users:User[]):Promise<User>[] => {
  return users.map(async user => {
    if (user.password) {
      user.password = await hashPassword(user.password);
      await user.save();
      return user;
    } else if (user.role === UserRole.DONOR && !user.password && !user.passwordLink) {
      await user.save();
      const link = new PasswordLink();
      link.uuid = uuid();
      await link.save();
      user.passwordLink = link;
      await user.save();
      return user;
    } else {
      await user.save();
      return user;
    }
      
  });
}

const getRandomBetween = (from:number = 0, to:number = 10): number => {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

const main = async () => {
  await createConnection();
  await getConnection()
      .createQueryBuilder()
      .delete()
      .from(PasswordLink)
      .execute();
  await getConnection().createQueryBuilder().delete().from(User).execute();
  const advisors = await Promise.all(saveUsers(generateAdvisors()));
  const donnors = await Promise.all(saveUsers(generateUsers(10)));
  await Promise.all(saveUsers(donnors.map(d => {
    d.advisorId = advisors[getRandomBetween(0, advisors.length - 1)].id;
    return d;
  })));
  process.exit(0);
};

main();