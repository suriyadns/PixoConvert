document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('file-list');
    const convertButton = document.getElementById('convert-button');
    const optionBoxes = document.querySelectorAll('.option-box');
    const formatButtons = document.querySelectorAll('.format-btn');

    const maxFiles = 10;
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff'];

    let uploadedFiles = [];
    let selectedFormat = null;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle files from the file input
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        let validFiles = [];
        for (const file of files) {
            if (uploadedFiles.length + validFiles.length >= maxFiles) {
                alert(`You can only upload a maximum of ${maxFiles} files.`);
                break;
            }

            let isValid = true;
            let errorMessage = '';

            // Validate file type
            if (!supportedImageTypes.includes(file.type)) {
                isValid = false;
                errorMessage = 'Invalid file type. Please upload a supported image.';
            }

            // Validate file size
            if (file.size > maxFileSize) {
                isValid = false;
                errorMessage = 'File size exceeds 50MB limit.';
            }

            if (isValid) {
                validFiles.push(file);
            } else {
                displayFile(file, errorMessage);
            }
        }

        uploadedFiles = uploadedFiles.concat(validFiles);
        updateFileList();
        updateConvertButtonState();
    }

    function updateFileList() {
        fileList.innerHTML = '';
        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                displayFile(file);
            });
        }
    }

    function displayFile(file, error = null) {
        const fileItem = document.createElement('li');
        fileItem.className = 'file-item';

        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';

        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;

        const fileSize = document.createElement('span');
        fileSize.className = 'file-size';
        fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';

        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        fileItem.appendChild(fileInfo);

        if (error) {
            const errorText = document.createElement('p');
            errorText.className = 'error-message';
            errorText.textContent = error;
            fileItem.appendChild(errorText);
        } else {
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-btn';
            removeButton.textContent = 'x';
            removeButton.onclick = () => {
                uploadedFiles = uploadedFiles.filter(f => f !== file);
                updateFileList();
                updateConvertButtonState();
            };
            fileItem.appendChild(removeButton);
        }

        fileList.appendChild(fileItem);
    }

    function updateConvertButtonState() {
        if (uploadedFiles.length > 0 && selectedFormat) {
            convertButton.disabled = false;
        } else {
            convertButton.disabled = true;
        }
    }

    // Handle format selection for main boxes
    optionBoxes.forEach(box => {
        box.addEventListener('click', () => {
            optionBoxes.forEach(b => b.classList.remove('selected'));
            formatButtons.forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
            selectedFormat = box.dataset.format;
            updateConvertButtonState();
        });
    });

    // Handle format selection for image format buttons
    formatButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            optionBoxes.forEach(b => b.classList.remove('selected'));
            formatButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedFormat = btn.dataset.format;
            updateConvertButtonState();
        });
    });

    // Conversion logic (placeholder)
    convertButton.addEventListener('click', () => {
        if (uploadedFiles.length === 0) {
            alert('Please upload files first.');
            return;
        }
        if (!selectedFormat) {
            alert('Please select an output format.');
            return;
        }
        
        alert(`Conversion started for ${uploadedFiles.length} file(s) to ${selectedFormat}. \n\nNote: This is a front-end prototype. The actual conversion requires a backend service.`);
    });
});