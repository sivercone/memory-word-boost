import { UserInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import FolderEntity from './FolderEntity';
import SetEntity from './SetEntity';

@Entity()
class UserEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  access_token: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  fingerprint: string;

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
