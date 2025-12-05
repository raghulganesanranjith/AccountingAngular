import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SetupConfigService, SetupSection, SetupItem } from '../../services/setup-config.service';

@Component({
  selector: 'app-setup-organization',
  templateUrl: './setup-organization.component.html',
  styleUrls: ['./setup-organization.component.scss']
})
export class SetupOrganizationComponent implements OnInit {
  setupSections: SetupSection[] = [];
  completedTasks: Set<string> = new Set();

  constructor(
    private setupConfigService: SetupConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSetupConfig();
  }

  loadSetupConfig(): void {
    this.setupSections = this.setupConfigService.getSetupConfig();
  }

  onItemClick(item: SetupItem): void {
    if (item.action) {
      item.action();
      this.markTaskAsCompleted(item.key);
    }
  }

  markTaskAsCompleted(key: string): void {
    this.completedTasks.add(key);
  }

  isTaskCompleted(key: string): boolean {
    return this.completedTasks.has(key);
  }

  getCompletionPercentage(): number {
    const total = this.setupSections.reduce((sum, section) => sum + section.items.length, 0);
    return total > 0 ? Math.round((this.completedTasks.size / total) * 100) : 0;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
