import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyBudget: number | null;

  @Column({ type: 'boolean', default: true })
  budgetAlertsEnabled: boolean;

  @Column({ type: 'int', default: 90 })
  budgetAlertThreshold: number; // Percentage (e.g., 90 = alert at 90%)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

