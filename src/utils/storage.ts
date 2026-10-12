import { PosterProject } from '../types/poster';
import { POSTER_TEMPLATES } from '../data/templates';

const STORAGE_KEY = 'poster_maker_projects_v1';
const DRAFT_KEY = 'poster_maker_active_draft_v1';
const PRO_STATUS_KEY = 'poster_maker_is_pro_v1';

export function getSavedProjects(): PosterProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial project cloned from template 1
      const initial = createInitialProjectFromTemplate();
      saveProjectsList([initial]);
      return [initial];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load saved projects', err);
    return [];
  }
}

export function saveProjectsList(projects: PosterProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects', err);
  }
}

export function saveProject(project: PosterProject): void {
  const list = getSavedProjects();
  const existingIdx = list.findIndex((p) => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    list[existingIdx] = updatedProject;
  } else {
    list.unshift(updatedProject);
  }

  saveProjectsList(list);
}

export function deleteProject(id: string): void {
  const list = getSavedProjects().filter((p) => p.id !== id);
  saveProjectsList(list);
}

export function duplicateProject(id: string): PosterProject | null {
  const list = getSavedProjects();
  const target = list.find((p) => p.id === id);
  if (!target) return null;

  const duplicated: PosterProject = {
    ...target,
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${target.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  list.unshift(duplicated);
  saveProjectsList(list);
  return duplicated;
}

export function getProjectById(id: string): PosterProject | null {
  const list = getSavedProjects();
  return list.find((p) => p.id === id) || null;
}

export function saveDraft(project: PosterProject): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(project));
  } catch (e) {
    console.warn('Could not save draft', e);
  }
}

export function getDraft(): PosterProject | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getProStatus(): boolean {
  try {
    return localStorage.getItem(PRO_STATUS_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setProStatus(isPro: boolean): void {
  try {
    localStorage.setItem(PRO_STATUS_KEY, isPro ? 'true' : 'false');
  } catch (e) {
    console.warn('Could not set pro status', e);
  }
}

function createInitialProjectFromTemplate(): PosterProject {
  const t = POSTER_TEMPLATES[0];
  return {
    id: `project-starter-orange-sale`,
    title: 'Weekend Super Sale',
    canvas: {
      width: t.width,
      height: t.height,
      aspectRatio: t.aspectRatio,
      background: t.background,
    },
    elements: JSON.parse(JSON.stringify(t.elements)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: t.category,
  };
}
