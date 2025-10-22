document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const lastStepBtn = document.getElementById('lastStepBtn');
    const finishBtn = document.getElementById('finishBtn');
    const filesList = document.getElementById('filesList');
    const filesCount = document.getElementById('filesCount');
    const filesContainer = document.getElementById('filesContainer');
    const clearAllBtn = document.getElementById('clearAll');
    
    let selectedFiles = [];
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFilesUpload(files);
        }
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFilesUpload(files);
        }
    });
    
    clearAllBtn.addEventListener('click', function() {
        selectedFiles = [];
        fileInput.value = '';
        filesList.style.display = 'none';
        updateUploadText();
    });
    
    function isValidFile(file) {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        return validTypes.includes(file.type) || 
               file.name.toLowerCase().endsWith('.pdf') ||
               file.name.toLowerCase().endsWith('.doc') ||
               file.name.toLowerCase().endsWith('.docx');
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function handleFilesUpload(files) {
        const validFiles = files.filter(file => {
            if (!isValidFile(file)) {
                return false;
            }
            if (!checkFileSize(file)) {
                return false;
            }
            return true;
        });
        
        if (validFiles.length === 0) {
            return;
        }
        
        validFiles.forEach(file => {
            if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        });
        
        updateFilesList();
        updateUploadText();
    }
    
    function updateFilesList() {
        if (selectedFiles.length === 0) {
            filesList.style.display = 'none';
            return;
        }
        
        filesList.style.display = 'block';
        filesCount.textContent = `已选择 ${selectedFiles.length} 个文件`;
        
        filesContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info-content">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="remove-file" data-index="${index}" aria-label="移除文件">×</button>
            `;
            
            const removeBtn = fileItem.querySelector('.remove-file');
            removeBtn.addEventListener('click', function() {
                selectedFiles.splice(index, 1);
                updateFilesList();
                updateUploadText();
            });
            
            filesContainer.appendChild(fileItem);
        });
    }
    
    function updateUploadText() {
        const uploadText = uploadArea.querySelector('.upload-text');
        if (selectedFiles.length === 0) {
            uploadText.textContent = 'Drag your resume file to this area, or click on the area to select the appropriate file to upload';
            uploadText.style.color = '#64748b';
            uploadText.style.fontWeight = 'normal';
        } else {
            uploadText.textContent = `已选择 ${selectedFiles.length} 个文件，点击或拖拽添加更多文件`;
            uploadText.style.color = '#3b82f6';
            uploadText.style.fontWeight = '500';
        }
    }
    
    function checkFileSize(file) {
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return false;
        }
        return true;
    }
    
    lastStepBtn.addEventListener('click', function() {
        console.log('返回上一步');
    });
    
    finishBtn.addEventListener('click', function() {
        console.log('完成上传');
    });
    
    uploadArea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });
    
    uploadArea.setAttribute('tabindex', '0');
    uploadArea.setAttribute('role', 'button');
    uploadArea.setAttribute('aria-label', '点击或拖拽文件到此处上传简历');
    
    const buttons = [lastStepBtn, finishBtn, clearAllBtn];
    buttons.forEach(btn => {
        btn.addEventListener('focus', function() {
            this.style.outline = '2px solid #3b82f6';
            this.style.outlineOffset = '2px';
        });
        
        btn.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    uploadArea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            return;
        }
        
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });
    
    if ('ontouchstart' in window) {
        uploadArea.addEventListener('touchstart', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('touchend', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            fileInput.click();
        });
    }
});