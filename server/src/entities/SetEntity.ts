import { SetInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import FolderEntity from './FolderEntity';
import UserEntity from './UserEntity';

@Entity()
class SetEntity implements SetInterface {
  @PrimaryColumn()
  id: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column('simple-json', { default: [] })
  cards: { order: number; front: string; back: string }[];

  @ManyToOne(() => FolderEntity, (x) => x.sets)
  @JoinTable()
  folder: FolderEntity;

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
