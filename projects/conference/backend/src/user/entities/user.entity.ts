import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Role } from './role.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, comment: '用户名' })
  username: string

  @Column({ length: 50, comment: '密码' })
  password: string

  @Column({ name: 'nick_name', length: 50, comment: '昵称' })
  nickName: string

  @Column({ length: 50, comment: '邮箱' })
  email: string

  @Column({ length: 100, nullable: true, comment: '头像' })
  avatar: string

  @Column({ length: 20, nullable: true, comment: '手机号' })
  phoneNumber: string

  @Column({ comment: '是否冻结', default: false })
  isFrozen: boolean

  @Column({ comment: '是否为管理员', default: false })
  isAdmin: boolean

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[]
}
