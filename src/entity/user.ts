import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn} from "typeorm";
import { PasswordLink } from "./passwordlink";

export enum UserRole {
  DONOR = 1,
  ADVISOR,
  ADMIN
};

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;
    
  @Column({
    length: 255,
    unique: true
  })
  email: string;
  
  @Column({
    type: "text",
    nullable: true
  })
  password: string;

  @Column({
    type: "int"
  })
  role: UserRole;
  
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    nullable: true
  })
  nickname: string;

  @Column({
    nullable: true
  })
  cid: string;

  @Column({nullable: true})
  tel: string;
  
  /**
   * Load the advisor ID but not the advisor account so we can save some 
   * bandwidth.
   */
  @Column({ nullable: true })
  advisorId: string;

  @OneToOne(() => PasswordLink, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn()
  passwordLink: PasswordLink | null;
}