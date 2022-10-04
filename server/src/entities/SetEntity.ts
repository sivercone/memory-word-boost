import { SetInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import FolderEntity from './FolderEntity';
import UserEntity from './UserEntity';

@Entity()
class SetEntity implements SetInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('simple-array')
  tags: string[];

  @Column('simple-json')
  cards: { term: string; definition: string }[];

  @ManyToMany(() => FolderEntity, (x) => x.sets)
  @JoinTable()
  folders: FolderEntity[];

  @ManyToOne(() => UserEntity, (x) => x.sets)
  user: UserEntity;

  @Column()
  @CreateDateColumn()
  createdAt: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: string;
}

export default SetEntity;
