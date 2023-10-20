import { FolderInterface } from '@/interfaces';
import { Column, CreateDateColumn, Entity, OneToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import SetEntity from './SetEntity';
import UserEntity from './UserEntity';

@Entity()
class FolderEntity implements FolderInterface {
  @PrimaryColumn()
  id: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => SetEntity, (x) => x.folder, { onDelete: 'CASCADE' })
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
