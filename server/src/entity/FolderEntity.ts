import { FolderInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import SetEntity from './SetEntity';

@Entity()
class FolderEntity implements FolderInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => SetEntity, (x) => x.folders)
  sets: SetEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: string;
}

export default FolderEntity;
