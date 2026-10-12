import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PosterProject,
  PosterTemplate,
  CanvasElement,
  BackgroundConfig,
  AspectRatioType,
  CategoryKey,
} from './types/poster';
import {
  getSavedProjects,
  saveProject,
  deleteProject as deleteProjectStorage,
  duplicateProject as duplicateProjectStorage,
  saveDraft,
  getDraft,
  getProStatus,
  setProStatus as setProStatusStorage,
} from './utils/storage';
import { POSTER_TEMPLATES } from './data/templates';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { TemplateGallery } from './components/TemplateGallery';
import { MyDesignsScreen } from './components/MyDesignsScreen';
import { EditorCanvas } from './components/Editor/EditorCanvas';
import { Toolbar } from './components/Editor/Toolbar';
import { ExportModal } from './components/ExportModal';
import { CreateScratchModal } from './components/CreateScratchModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'templates' | 'designs' | 'editor'>('home');
  const [projects, setProjects] = useState<PosterProject[]>([]);
  const [activeProject, setActiveProject] = useState<PosterProject | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Undo/Redo history stack
  const [undoStack, setUndoStack] = useState<PosterProject[]>([]);
  const [redoStack, setRedoStack] = useState<PosterProject[]>([]);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState<CategoryKey>('all');

  // Load initial data on mount
  useEffect(() => {
    const loadedProjects = getSavedProjects();
    setProjects(loadedProjects);
    setIsPro(getProStatus());

    // Check if there was an active draft
    const draft = getDraft();
    if (draft && loadedProjects.some((p) => p.id === draft.id)) {
      setActiveProject(draft);
    } else if (loadedProjects.length > 0) {
      setActiveProject(loadedProjects[0]);
    }
  }, []);

  // Autosave active project
  useEffect(() => {
    if (!activeProject) return;
    const timer = setTimeout(() => {
      saveProject(activeProject);
      saveDraft(activeProject);
      setProjects(getSavedProjects());
      setIsSaved(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [activeProject]);

  // Push state to undo stack before making changes
  const pushUndo = useCallback((prev: PosterProject) => {
    setUndoStack((stack) => [...stack.slice(-25), JSON.parse(JSON.stringify(prev))]);
    setRedoStack([]);
    setIsSaved(false);
  }, []);

  // Undo handler
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || !activeProject) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, -1);

    setRedoStack((stack) => [...stack, JSON.parse(JSON.stringify(activeProject))]);
    setUndoStack(newUndo);
    setActiveProject(previous);
    setIsSaved(false);
  }, [undoStack, activeProject]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || !activeProject) return;
    const next = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);

    setUndoStack((stack) => [...stack, JSON.parse(JSON.stringify(activeProject))]);
    setRedoStack(newRedo);
    setActiveProject(next);
    setIsSaved(false);
  }, [redoStack, activeProject]);

  // Keyboard shortcuts (Undo, Redo, Delete, Deselect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId && activeProject && currentView === 'editor') {
          e.preventDefault();
          handleDeleteElement(selectedElementId);
        }
      } else if (e.key === 'Escape') {
        setSelectedElementId(null);
        setIsExportOpen(false);
        setIsScratchOpen(false);
        setIsProModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, activeProject, currentView, handleUndo, handleRedo]);

  // Element actions
  const handleUpdateElement = (updated: CanvasElement) => {
    if (!activeProject) return;
    setActiveProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        elements: prev.elements.map((el) => (el.id === updated.id ? updated : el)),
      };
    });
    setIsSaved(false);
  };

  const handleElementChangeEnd = () => {
    if (activeProject) {
      pushUndo(activeProject);
    }
  };

  const handleAddElement = (element: CanvasElement) => {
    if (!activeProject) return;
    pushUndo(activeProject);
    setActiveProject({
      ...activeProject,
      elements: [...activeProject.elements, element],
    });
    setSelectedElementId(element.id);
  };

  const handleDuplicateElement = (id: string) => {
    if (!activeProject) return;
    const target = activeProject.elements.find((el) => el.id === id);
    if (!target) return;

    pushUndo(activeProject);
    const duplicated: CanvasElement = {
      ...JSON.parse(JSON.stringify(target)),
      id: `${target.type}-${Date.now()}`,
      x: target.x + 30,
      y: target.y + 30,
      zIndex: Math.max(...activeProject.elements.map((e) => e.zIndex)) + 1,
    };

    setActiveProject({
      ...activeProject,
      elements: [...activeProject.elements, duplicated],
    });
    setSelectedElementId(duplicated.id);
  };

  const handleDeleteElement = (id: string) => {
    if (!activeProject) return;
    pushUndo(activeProject);
    setActiveProject({
      ...activeProject,
      elements: activeProject.elements.filter((el) => el.id !== id),
    });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleReorderLayer = (id: string, direction: 'up' | 'down') => {
    if (!activeProject) return;
    pushUndo(activeProject);

    const sorted = [...activeProject.elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((el) => el.id === id);
    if (index < 0) return;

    if (direction === 'up' && index < sorted.length - 1) {
      // Swap zIndex with next element
      const tempZ = sorted[index].zIndex;
      sorted[index].zIndex = sorted[index + 1].zIndex;
      sorted[index + 1].zIndex = tempZ;
    } else if (direction === 'down' && index > 0) {
      // Swap zIndex with previous element
      const tempZ = sorted[index].zIndex;
      sorted[index].zIndex = sorted[index - 1].zIndex;
      sorted[index - 1].zIndex = tempZ;
    }

    setActiveProject({
      ...activeProject,
      elements: [...sorted],
    });
  };

  const handleToggleLock = (id: string) => {
    if (!activeProject) return;
    setActiveProject({
      ...activeProject,
      elements: activeProject.elements.map((el) =>
        el.id === id ? { ...el, locked: !el.locked } : el
      ),
    });
  };

  const handleToggleVisibility = (id: string) => {
    if (!activeProject) return;
    setActiveProject({
      ...activeProject,
      elements: activeProject.elements.map((el) =>
        el.id === id ? { ...el, hidden: !el.hidden } : el
      ),
    });
  };

  const handleUpdateBackground = (bg: BackgroundConfig) => {
    if (!activeProject) return;
    pushUndo(activeProject);
    setActiveProject({
      ...activeProject,
      canvas: {
        ...activeProject.canvas,
        background: bg,
      },
    });
  };

  const handleChangeAspectRatio = (ratio: AspectRatioType, width: number, height: number) => {
    if (!activeProject) return;
    pushUndo(activeProject);
    setActiveProject({
      ...activeProject,
      canvas: {
        ...activeProject.canvas,
        aspectRatio: ratio,
        width,
        height,
      },
    });
  };

  // Open Template in Editor (Journey A)
  const handleOpenTemplate = (template: PosterTemplate) => {
    const newProj: PosterProject = {
      id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: template.title,
      canvas: {
        width: template.width,
        height: template.height,
        aspectRatio: template.aspectRatio,
        background: JSON.parse(JSON.stringify(template.background)),
      },
      elements: JSON.parse(JSON.stringify(template.elements)),
      category: template.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(newProj);
    setProjects(getSavedProjects());
    setActiveProject(newProj);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedElementId(null);
    setCurrentView('editor');
  };

  // Open Project in Editor (Journey C)
  const handleOpenProject = (project: PosterProject) => {
    setActiveProject(project);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedElementId(null);
    setCurrentView('editor');
  };

  // Create Project from Scratch (Journey B)
  const handleCreateProjectScratch = (newProj: PosterProject) => {
    saveProject(newProj);
    setProjects(getSavedProjects());
    setActiveProject(newProj);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedElementId(null);
    setIsScratchOpen(false);
    setCurrentView('editor');
  };

  // Duplicate Project
  const handleDuplicateProject = (id: string) => {
    const duplicated = duplicateProjectStorage(id);
    if (duplicated) {
      setProjects(getSavedProjects());
    }
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    deleteProjectStorage(id);
    setProjects(getSavedProjects());
    if (activeProject?.id === id) {
      const remaining = getSavedProjects();
      setActiveProject(remaining[0] || null);
    }
  };

  // Rename Project
  const handleRenameProject = (id: string, newTitle: string) => {
    const target = projects.find((p) => p.id === id);
    if (target) {
      const updated = { ...target, title: newTitle };
      saveProject(updated);
      setProjects(getSavedProjects());
      if (activeProject?.id === id) {
        setActiveProject(updated);
      }
    }
  };

  // Pro status toggle
  const handleTogglePro = (nextState: boolean) => {
    setIsPro(nextState);
    setProStatusStorage(nextState);
  };

  // Navigate to template gallery with preset category
  const handleNavigateToTemplates = (cat: CategoryKey = 'all') => {
    setGalleryCategory(cat);
    setCurrentView('templates');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Application Bar */}
      <Header
        currentView={currentView}
        projectTitle={activeProject?.title}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        isSaved={isSaved}
        isPro={isPro}
        onNavigate={setCurrentView}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={() => setIsExportOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        onUpdateTitle={(title) => {
          if (activeProject) {
            setActiveProject({ ...activeProject, title });
            saveProject({ ...activeProject, title });
          }
        }}
        onOpenCreateScratch={() => setIsScratchOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentView === 'home' && (
          <HomeScreen
            recentProjects={projects}
            isPro={isPro}
            onOpenProject={handleOpenProject}
            onOpenTemplate={handleOpenTemplate}
            onOpenCreateScratch={() => setIsScratchOpen(true)}
            onNavigateToTemplates={handleNavigateToTemplates}
            onOpenProModal={() => setIsProModalOpen(true)}
          />
        )}

        {currentView === 'templates' && (
          <TemplateGallery
            initialCategory={galleryCategory}
            onSelectTemplate={handleOpenTemplate}
            onOpenCreateScratch={() => setIsScratchOpen(true)}
          />
        )}

        {currentView === 'designs' && (
          <MyDesignsScreen
            projects={projects}
            onOpenProject={handleOpenProject}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
            onOpenCreateScratch={() => setIsScratchOpen(true)}
            onExportProjectDirect={(proj) => {
              setActiveProject(proj);
              setIsExportOpen(true);
            }}
          />
        )}

        {currentView === 'editor' && activeProject && (
          <div className="flex-1 w-full h-full flex flex-col md:flex-row overflow-hidden relative">
            {/* Center Interactive Canvas Viewport */}
            <div className="flex-1 h-full min-h-[300px] flex flex-col relative overflow-hidden">
              <EditorCanvas
                project={activeProject}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onElementChangeEnd={handleElementChangeEnd}
              />
            </div>

            {/* Bottom/Side Toolbar Panel */}
            <div className="w-full md:w-96 md:h-full md:border-l md:border-t-0 border-t border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20">
              <Toolbar
                project={activeProject}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onAddElement={handleAddElement}
                onDuplicateElement={handleDuplicateElement}
                onDeleteElement={handleDeleteElement}
                onReorderLayer={handleReorderLayer}
                onToggleLock={handleToggleLock}
                onToggleVisibility={handleToggleVisibility}
                onUpdateBackground={handleUpdateBackground}
                onChangeAspectRatio={handleChangeAspectRatio}
              />
            </div>
          </div>
        )}
      </main>

      {/* Android Bottom Navigation (Visible when not in Editor) */}
      <BottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenCreateScratch={() => setIsScratchOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* Export Modal */}
      {isExportOpen && activeProject && (
        <ExportModal
          project={activeProject}
          isPro={isPro}
          onClose={() => setIsExportOpen(false)}
          onUpgradePro={() => {
            setIsExportOpen(false);
            setIsProModalOpen(true);
          }}
        />
      )}

      {/* Create Scratch Modal */}
      {isScratchOpen && (
        <CreateScratchModal
          onClose={() => setIsScratchOpen(false)}
          onCreateProject={handleCreateProjectScratch}
        />
      )}

      {/* Pro Upgrade Modal */}
      {isProModalOpen && (
        <ProUpgradeModal
          isPro={isPro}
          onClose={() => setIsProModalOpen(false)}
          onTogglePro={handleTogglePro}
        />
      )}
    </div>
  );
}
