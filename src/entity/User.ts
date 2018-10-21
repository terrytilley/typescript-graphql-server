import * as bcrypt from "bcryptjs";
import {
  Column,
  Entity,
  BaseEntity,
  BeforeInsert,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 255 })
  email: string;

  @Column("text")
  password: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
