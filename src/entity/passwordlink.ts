import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class PasswordLink extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;
}