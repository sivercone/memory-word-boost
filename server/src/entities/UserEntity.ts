import { UserInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import FolderEntity from './FolderEntity';
import SetEntity from './SetEntity';

@Entity()
class UserEntity implements UserInterface {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  bio: string;

  @Column({ select: false, default: '' })
  refresh_token: string;

  @OneToMany(() => SetEntity, (x) => x.user)
  sets: SetEntity[];

  @OneToMany(() => FolderEntity, (x) => x.user)
  folders: FolderEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: string;
}

export default UserEntity;
