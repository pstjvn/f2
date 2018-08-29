import {createConnection} from 'typeorm';
import {User, UserRole} from '../src/entity/user';
import { PasswordLink } from '../src/entity/passwordlink';
import {hashPassword} from  '../crypt';
import {v4 as uuid} from 'uuid';

const users = [
  {
    email: 'donnor1@test.com',
    firstname: 'Donnor1',
    lastname: 'Donnor',
    role: UserRole.DONOR,
    cid: 'ksajksja'
  },
  // With predefined password / import
  {
    email: 'donnor2@test.com',
    firstname: 'Donnor2',
    lastname: 'Donnor',
    password: 'qwerty1',
    role: UserRole.DONOR,
    cid: 'ksajksja'
  },
  {
    email: 'advisor1@test.com',
    password: 'advisor1',
    firstname: 'Advisor1',
    lastname: 'Advisor',
    role: UserRole.ADVISOR
  },
  {
    email: 'admin1@test.com',
    password: 'admin1',
    firstname: 'Admin1',
    lastname: 'Admin',
    role: UserRole.ADMIN
  },
  {
    email: 'peterj@mail.bg',
    password: '123456',
    firstname: 'Peter',
    lastname: 'StJ',
    role: UserRole.ADVISOR
  }
];

const main = async () => {
  await createConnection();
  const promises: Promise<User>[] = users.map(async _ => {
    const user = new User();
    user.email = _.email;
    user.firstname = _.firstname;
    user.lastname = _.lastname;
    if (_.cid) user.cid = _.cid;
    user.role = _.role;
    if (_.password) {
      user.password = await hashPassword(_.password);
      await user.save();
      return user;
    } else {
      await user.save();
      const link = new PasswordLink();
      link.uuid = uuid();
      await link.save();
      user.passwordLink = link;
      await user.save();
      return user;
    }
  });

  await Promise.all(promises);
  process.exit(0);
};

main();