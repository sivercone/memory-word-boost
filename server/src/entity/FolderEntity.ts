import { FolderInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import SetEntity from './SetEntity';
import UserEntity from './UserEntity';

@Entity()
class FolderEntity implements FolderInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => SetEntity, (x) => x.folders, { onDelete: 'CASCADE' })
  sets: SetEntity[];

  @ManyToOne(() => UserEntity, (x) => x.folders)
  user: UserEntity;

  @Column()
  @CreateDateColumn()
  createdAt: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: string;
}

export default FolderEntity;
