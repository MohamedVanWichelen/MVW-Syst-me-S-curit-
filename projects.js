// Gestion Rapide des Projets Web
const PROJECTS_CONFIG = {
    storageKey: 'web_projects',
    maxProjects: 100
};

// Variables globales
let projects = [];
let currentProjectId = null;

// Éléments DOM
const projectsGrid = document.getElementById('projects-grid');
const addProjectOverlay = document.getElementById('add-project-overlay');
const quickProjectForm = document.getElementById('quick-project-form');
const confirmModal = document.getElementById('confirm-modal');
const searchInput = document.getElementById('search-input');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
    setupEventListeners();
    loadProjects();
    renderProjects();
});

// Initialisation des projets
function initializeProjects() {
    // Projets d'exemple pour démarrer
    const sampleProjects = [
        {
            id: 1,
            title: 'Portfolio Personnel',
            description: 'Site web personnel pour présenter mes compétences et projets',
            category: 'portfolio',
            createdAt: new Date().toISOString(),
            content: 'Contenu détaillé du portfolio personnel...'
        },
        {
            id: 2,
            title: 'Blog Tech',
            description: 'Blog sur les nouvelles technologies et le développement web',
            category: 'blog',
            createdAt: new Date().toISOString(),
            content: 'Contenu détaillé du blog tech...'
        },
        {
            id: 3,
            title: 'E-commerce Vintage',
            description: 'Boutique en ligne avec design rétro années 80-90',
            category: 'ecommerce',
            createdAt: new Date().toISOString(),
            content: 'Contenu détaillé de l\'e-commerce vintage...'
        }
    ];

    // Charger les projets existants ou utiliser les exemples
    const existingProjects = localStorage.getItem(PROJECTS_CONFIG.storageKey);
    if (!existingProjects) {
        projects = sampleProjects;
        saveProjects();
    }
}

// Configuration des événements
function setupEventListeners() {
    // Formulaire d'ajout rapide
    quickProjectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createProject();
    });

    // Recherche en temps réel
    searchInput.addEventListener('input', function() {
        searchProjects();
    });
}

// Affichage du formulaire d'ajout
function showAddProjectForm() {
    addProjectOverlay.classList.add('active');
    document.getElementById('project-title').focus();
}

// Masquage du formulaire d'ajout
function hideAddProjectForm() {
    addProjectOverlay.classList.remove('active');
    quickProjectForm.reset();
}

// Création d'un nouveau projet
function createProject() {
    const formData = new FormData(quickProjectForm);
    const projectData = {
        id: Date.now(),
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        category: formData.get('category'),
        createdAt: new Date().toISOString(),
        content: 'Contenu détaillé du projet...'
    };

    // Validation
    if (!projectData.title) {
        showToast('Le titre du projet est requis', 'error');
        return;
    }

    projects.push(projectData);
    saveProjects();
    renderProjects();
    hideAddProjectForm();
    showToast('Projet créé avec succès !', 'success');
}

// Rendu des projets
function renderProjects() {
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open"></i>
                <h3>Aucun projet trouvé</h3>
                <p>Créez votre premier projet en cliquant sur "Nouveau Projet"</p>
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-id="${project.id}" onclick="openProject(${project.id})">
            <div class="project-header">
                <div>
                    <div class="project-title">${project.title}</div>
                    <div class="project-category">${getCategoryLabel(project.category)}</div>
                </div>
                <div class="project-actions" onclick="event.stopPropagation()">
                    <button class="action-btn edit-btn" onclick="editProject(${project.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProject(${project.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="project-description">${project.description || 'Aucune description'}</div>
        </div>
    `).join('');
}

// Ouverture d'un projet
function openProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Créer une nouvelle page pour afficher le projet
    const projectWindow = window.open('', '_blank');
    projectWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${project.title}</title>
            <style>
                body { 
                    font-family: 'Inter', sans-serif; 
                    margin: 0; 
                    padding: 2rem; 
                    background: #f8fafc; 
                    color: #1e293b;
                }
                .project-header { 
                    background: white; 
                    padding: 2rem; 
                    border-radius: 0.75rem; 
                    margin-bottom: 2rem; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .project-title { 
                    font-size: 2rem; 
                    font-weight: 700; 
                    color: #2563eb; 
                    margin-bottom: 1rem;
                }
                .project-meta { 
                    color: #64748b; 
                    margin-bottom: 1rem;
                }
                .project-description { 
                    font-size: 1.125rem; 
                    line-height: 1.6;
                }
                .project-content { 
                    background: white; 
                    padding: 2rem; 
                    border-radius: 0.75rem; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .back-btn { 
                    background: #2563eb; 
                    color: white; 
                    padding: 0.75rem 1.5rem; 
                    border: none; 
                    border-radius: 0.5rem; 
                    cursor: pointer; 
                    text-decoration: none; 
                    display: inline-block; 
                    margin-bottom: 1rem;
                }
            </style>
        </head>
        <body>
            <a href="#" class="back-btn" onclick="window.close()">← Retour à la liste</a>
            <div class="project-header">
                <div class="project-title">${project.title}</div>
                <div class="project-meta">
                    <strong>Catégorie:</strong> ${getCategoryLabel(project.category)} | 
                    <strong>Créé le:</strong> ${new Date(project.createdAt).toLocaleDateString('fr-FR')}
                </div>
                <div class="project-description">${project.description || 'Aucune description'}</div>
            </div>
            <div class="project-content">
                <h2>Contenu du Projet</h2>
                <p>${project.content}</p>
                <p>Ici vous pouvez ajouter tout le contenu détaillé de votre projet web :</p>
                <ul>
                    <li>Spécifications techniques</li>
                    <li>Maquettes et designs</li>
                    <li>Code source</li>
                    <li>Documentation</li>
                    <li>Liens et ressources</li>
                </ul>
            </div>
        </body>
        </html>
    `);
}

// Édition d'un projet
function editProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Remplir le formulaire
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-category').value = project.category;

    // Modifier le bouton de soumission
    const submitBtn = quickProjectForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Mettre à jour';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        updateProject(projectId);
    };

    showAddProjectForm();
}

// Mise à jour d'un projet
function updateProject(projectId) {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;

    const formData = new FormData(quickProjectForm);
    projects[projectIndex] = {
        ...projects[projectIndex],
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        category: formData.get('category'),
        updatedAt: new Date().toISOString()
    };

    saveProjects();
    renderProjects();
    hideAddProjectForm();
    showToast('Projet mis à jour !', 'success');
}

// Suppression d'un projet
function deleteProject(projectId) {
    showConfirmModal(projectId);
}

// Affichage du modal de confirmation
function showConfirmModal(projectId) {
    confirmModal.classList.add('active');
    
    const confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.onclick = function() {
        projects = projects.filter(p => p.id !== projectId);
        saveProjects();
        renderProjects();
        closeConfirmModal();
        showToast('Projet supprimé', 'success');
    };
}

// Fermeture du modal de confirmation
function closeConfirmModal() {
    confirmModal.classList.remove('active');
}

// Recherche de projets
function searchProjects() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderProjects();
        return;
    }

    const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        getCategoryLabel(project.category).toLowerCase().includes(searchTerm)
    );

    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-search"></i>
                <h3>Aucun projet trouvé</h3>
                <p>Aucun projet ne correspond à votre recherche</p>
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card" data-id="${project.id}" onclick="openProject(${project.id})">
            <div class="project-header">
                <div>
                    <div class="project-title">${project.title}</div>
                    <div class="project-category">${getCategoryLabel(project.category)}</div>
                </div>
                <div class="project-actions" onclick="event.stopPropagation()">
                    <button class="action-btn edit-btn" onclick="editProject(${project.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProject(${project.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="project-description">${project.description || 'Aucune description'}</div>
        </div>
    `).join('');
}

// Sauvegarde des projets
function saveProjects() {
    localStorage.setItem(PROJECTS_CONFIG.storageKey, JSON.stringify(projects));
}

// Chargement des projets
function loadProjects() {
    const stored = localStorage.getItem(PROJECTS_CONFIG.storageKey);
    if (stored) {
        projects = JSON.parse(stored);
    }
}

// Affichage des notifications toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Icône pour les notifications
function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

// Utilitaires
function getCategoryLabel(category) {
    const labels = {
        'portfolio': 'Portfolio',
        'ecommerce': 'E-commerce',
        'blog': 'Blog',
        'webapp': 'Application Web',
        'landing': 'Landing Page',
        'other': 'Autre'
    };
    return labels[category] || category;
}

// Déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        window.location.href = 'index.html';
    }
}

// Gestion des raccourcis clavier
document.addEventListener('keydown', function(e) {
    // Ctrl + N pour nouveau projet
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showAddProjectForm();
    }
    
    // Échap pour fermer le formulaire
    if (e.key === 'Escape') {
        hideAddProjectForm();
        closeConfirmModal();
    }
});

// Sauvegarde automatique
window.addEventListener('beforeunload', function() {
    saveProjects();
});
