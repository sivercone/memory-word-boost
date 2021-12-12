import { SetInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import FolderEntity from './FolderEntity';

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

  @Column()
  @CreateDateColumn()
  createdAt: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: string;
}

export default SetEntity;
