# Skeleton Screen Usage Guide

## Overview
Skeleton screens provide visual feedback while content is loading, improving perceived performance and user experience.

## CSS Classes Added

### Base Skeleton Class
```css
.skeleton
```
Applies the shimmer loading animation to any element.

### Specific Skeleton Variations

1. **Project Cards**
```html
<div class="project-card skeleton">
  <!-- Content will show loading state -->
</div>
```

2. **Modal Content**
```html
<div class="modal-body skeleton">
  <!-- Modal content shows loading state -->
</div>
```

3. **Skill Items**
```html
<div class="skill-item skeleton">
  <!-- Skill bars show loading state -->
</div>
```

4. **Text Skeletons**
```html
<div class="skeleton-text skeleton-title"></div>
<div class="skeleton-text skeleton-paragraph"></div>
<div class="skeleton-text skeleton-paragraph"></div>
```

## JavaScript Usage

### Using the Built-in Methods

```javascript
// Get reference to PortfolioApp instance
const app = new PortfolioApp();

// Show skeleton
const element = document.querySelector('.project-card');
app.showSkeleton(element);

// Hide skeleton after content loads
setTimeout(() => {
  app.hideSkeleton(element);
}, 1000);
```

### Example: Loading Projects Dynamically

```javascript
// Show skeleton while fetching
const projectGrid = document.querySelector('.projects-grid');
projectGrid.innerHTML = `
  <div class="project-card skeleton"></div>
  <div class="project-card skeleton"></div>
  <div class="project-card skeleton"></div>
`;

// Fetch data
fetch('/api/projects')
  .then(response => response.json())
  .then(projects => {
    // Replace skeletons with actual content
    projectGrid.innerHTML = projects.map(project => `
      <div class="project-card" data-project="${project.id}">
        <!-- Actual project content -->
      </div>
    `).join('');
  });
```

### Example: Modal with Skeleton

```javascript
openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalBody = document.querySelector('.modal-body');
  
  // Show modal with skeleton
  modal.classList.remove('hidden');
  modal.classList.add('show');
  modalBody.classList.add('skeleton');
  
  // Simulate async data loading
  setTimeout(() => {
    // Populate modal content
    const project = this.projects[projectId];
    document.getElementById('modal-project-title').textContent = project.title;
    // ... populate other fields
    
    // Remove skeleton
    modalBody.classList.remove('skeleton');
  }, 300);
}
```

## Best Practices

1. **Show skeleton immediately** when user triggers an action
2. **Match skeleton shape** to actual content layout
3. **Remove skeleton** as soon as content is ready
4. **Use consistent timing** - typically 300-500ms minimum for perception
5. **Don't overuse** - only for content that actually loads dynamically

## Animation Details

- **Animation Duration**: 1.5s
- **Animation Style**: Smooth shimmer effect from left to right
- **Colors**: Semi-transparent white gradient on dark background
- **Border Radius**: Matches project design (8px)

## Customization

To customize the skeleton colors or animation:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    your-color-1 0%,
    your-color-2 50%,
    your-color-1 100%
  );
  animation-duration: 2s; /* Adjust speed */
}
```

## Browser Support

- ✅ Chrome/Edge (Modern)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Examples in Your Portfolio

The skeleton screens are ready to use for:
- **Project cards** loading from API
- **Modal content** when opening project details
- **Skill bars** when fetching user stats
- **Any dynamic content** that needs loading state
