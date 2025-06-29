document.addEventListener('DOMContentLoaded', () => {
    const customWeightsToggle = document.getElementById('custom-weights');
    const resetButton = document.getElementById('reset-matrix');
    const formulaDisplay = document.getElementById('formula-display');
    
    // Load saved data from localStorage
    loadSavedData();
    
    // Initialize all project cards
    initializeProjectCards();
    
    // Set up event listeners
    setupEventListeners();
    
    function initializeProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const projectId = card.dataset.project;
            const costSlider = card.querySelector('.cost');
            const impactSlider = card.querySelector('.impact');
            const effortSlider = card.querySelector('.effort');
            const scoreBadge = card.querySelector('.score-badge');
            const projectName = card.querySelector('.project-name');
            const takeaway = card.querySelector('.takeaway');
            
            // Update slider values display
            updateSliderValue(costSlider);
            updateSliderValue(impactSlider);
            updateSliderValue(effortSlider);
            
            // Calculate initial score
            updateScore(card);
            
            // Add input listeners for sliders
            [costSlider, impactSlider, effortSlider].forEach(slider => {
                slider.addEventListener('input', () => {
                    updateSliderValue(slider);
                    updateScore(card);
                    saveData();
                });
            });
            
            // Add input listeners for text fields
            projectName.addEventListener('input', saveData);
            takeaway.addEventListener('input', saveData);
        });
    }
    
    function updateSliderValue(slider) {
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        valueDisplay.textContent = slider.value;
    }
    
    function updateScore(card) {
        const costValue = parseInt(card.querySelector('.cost').value);
        const impactValue = parseInt(card.querySelector('.impact').value);
        const effortValue = parseInt(card.querySelector('.effort').value);
        const scoreBadge = card.querySelector('.score-badge');
        
        let score;
        const useCustomWeights = customWeightsToggle.checked;
        
        if (useCustomWeights) {
            // Custom weights: Impact x2, Effort x-1, Cost x-1
            score = (impactValue * 2) + ((10 - effortValue) * 1) + ((10 - costValue) * 1);
            score = score / 4; // Normalize to 0-10 scale
        } else {
            // Equal weights
            score = (impactValue + (10 - effortValue) + (10 - costValue)) / 3;
        }
        
        const roundedScore = Math.round(score * 10) / 10;
        scoreBadge.textContent = roundedScore.toFixed(1);
        scoreBadge.dataset.score = roundedScore.toFixed(1);
        
        // Update score level for color coding
        updateScoreLevel(scoreBadge, roundedScore);
        
        // Add animation effect
        scoreBadge.style.transform = 'scale(1.1)';
        setTimeout(() => {
            scoreBadge.style.transform = 'scale(1)';
        }, 200);
    }
    
    function updateScoreLevel(scoreBadge, score) {
        scoreBadge.removeAttribute('data-score-level');
        
        if (score >= 7) {
            scoreBadge.setAttribute('data-score-level', 'high');
        } else if (score >= 4) {
            scoreBadge.setAttribute('data-score-level', 'medium');
        } else {
            scoreBadge.setAttribute('data-score-level', 'low');
        }
    }
    
    function updateFormula() {
        const useCustomWeights = customWeightsToggle.checked;
        
        if (useCustomWeights) {
            formulaDisplay.textContent = 'Custom weights: ((Impact × 2) + (10-Effort) + (10-Cost)) ÷ 4';
        } else {
            formulaDisplay.textContent = 'Equal weights: (Impact + (10-Effort) + (10-Cost)) ÷ 3';
        }
    }
    
    function setupEventListeners() {
        // Custom weights toggle
        customWeightsToggle.addEventListener('change', () => {
            updateFormula();
            updateAllScores();
            saveData();
        });
        
        // Reset button
        resetButton.addEventListener('click', resetMatrix);
        
        // Initialize formula display
        updateFormula();
    }
    
    function updateAllScores() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => updateScore(card));
    }
    
    function resetMatrix() {
        if (!confirm('Are you sure you want to reset all values? This action cannot be undone.')) {
            return;
        }
        
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            // Reset sliders to default value (5)
            const sliders = card.querySelectorAll('input[type="range"]');
            sliders.forEach(slider => {
                slider.value = 5;
                updateSliderValue(slider);
            });
            
            // Reset project name to placeholder
            const projectName = card.querySelector('.project-name');
            projectName.value = '';
            
            // Reset takeaway
            const takeaway = card.querySelector('.takeaway');
            takeaway.value = '';
            
            // Update score
            updateScore(card);
        });
        
        // Reset custom weights toggle
        customWeightsToggle.checked = false;
        updateFormula();
        
        // Clear localStorage
        localStorage.removeItem('decisionMatrix');
        
        // Add visual feedback
        resetButton.textContent = 'Reset ✓';
        resetButton.style.background = '#22c55e';
        setTimeout(() => {
            resetButton.textContent = 'Reset Matrix';
            resetButton.style.background = '';
        }, 1500);
    }
    
    function saveData() {
        const data = {
            customWeights: customWeightsToggle.checked,
            projects: []
        };
        
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const projectId = card.dataset.project;
            const projectData = {
                id: projectId,
                name: card.querySelector('.project-name').value,
                cost: card.querySelector('.cost').value,
                impact: card.querySelector('.impact').value,
                effort: card.querySelector('.effort').value,
                takeaway: card.querySelector('.takeaway').value
            };
            data.projects.push(projectData);
        });
        
        localStorage.setItem('decisionMatrix', JSON.stringify(data));
    }
    
    function loadSavedData() {
        const savedData = localStorage.getItem('decisionMatrix');
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            
            // Restore custom weights setting
            customWeightsToggle.checked = data.customWeights || false;
            
            // Restore project data
            data.projects.forEach(projectData => {
                const card = document.querySelector(`[data-project="${projectData.id}"]`);
                if (card) {
                    card.querySelector('.project-name').value = projectData.name || '';
                    card.querySelector('.cost').value = projectData.cost || 5;
                    card.querySelector('.impact').value = projectData.impact || 5;
                    card.querySelector('.effort').value = projectData.effort || 5;
                    card.querySelector('.takeaway').value = projectData.takeaway || '';
                }
            });
        } catch (e) {
            console.warn('Error loading saved matrix data:', e);
        }
    }
    
    // Export functionality (bonus feature)
    function exportToPNG() {
        // This would require a library like html2canvas
        // For now, we'll just copy the data to clipboard
        const data = JSON.parse(localStorage.getItem('decisionMatrix') || '{}');
        const exportText = generateExportText(data);
        
        navigator.clipboard.writeText(exportText).then(() => {
            alert('Matrix data copied to clipboard!');
        }).catch(() => {
            alert('Export failed. Please try again.');
        });
    }
    
    function generateExportText(data) {
        let text = 'Decision Matrix Results\n';
        text += '======================\n\n';
        
        if (data.projects) {
            data.projects.forEach((project, index) => {
                text += `${index + 1}. ${project.name || `Idea ${String.fromCharCode(65 + index)}`}\n`;
                text += `   Cost: ${project.cost}/10, Impact: ${project.impact}/10, Effort: ${project.effort}/10\n`;
                if (project.takeaway) {
                    text += `   Takeaway: ${project.takeaway}\n`;
                }
                text += '\n';
            });
        }
        
        text += `Scoring Method: ${data.customWeights ? 'Custom Weights' : 'Equal Weights'}\n`;
        text += `Generated: ${new Date().toLocaleDateString()}\n`;
        
        return text;
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + R for reset (prevent page reload)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            resetMatrix();
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportToPNG();
        }
    });
});
