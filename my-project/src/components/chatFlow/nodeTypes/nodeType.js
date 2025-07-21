import React from 'react';
import { CustomEdge } from '../CustomEdge';

// Define all custom node types using dynamic imports (React.lazy)
export const NodeTypes = {
  text: React.lazy(() => import('./TextUpdaterNode')),                   // 📄 Plain text node
  image: React.lazy(() => import('./ImageEditorNode')),                 // 🖼️ Image node
  audio: React.lazy(() => import('./AudioNode')),                       // 🔊 Audio playback node
  interactive_buttons: React.lazy(() => import('./InteractiveButton')), // 🔘 Button-based interaction
  interactive_list_section: React.lazy(() => import('./InteractiveListSection')), // 📋 Section-based list node
  interactive_list_row: React.lazy(() => import('./InteractiveListRow')),
  template: React.lazy(() => import('./TemplateNode')),
  video: React.lazy(() => import('./VideoNode')),
};

// Define custom edge type if using something other than default bezier/straight/step edges
export const edgeTypes = {
  custom: CustomEdge, // 🧠 Your own edge design logic
};
