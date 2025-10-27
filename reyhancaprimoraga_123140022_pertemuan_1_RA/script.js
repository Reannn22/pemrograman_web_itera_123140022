function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        // Add modal state to URL
        const url = new URL(window.location);
        url.searchParams.set('modal', id);
        window.history.pushState({}, '', url);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        // Remove modal state from URL
        const url = new URL(window.location);
        url.searchParams.delete('modal');
        window.history.pushState({}, '', url);
    }
}

function setAddStatus(status, btn) {
    document.getElementById('addStatus').value = status;
    Array.from(btn.parentNode.children).forEach(b => {
        b.classList.remove('border-blue-700', 'border-4');
        b.classList.add('border-blue-600', 'border-2');
        b.classList.remove('bg-blue-600', 'text-white');
        if (b.textContent.trim() === 'Belum Selesai') {
            b.classList.add('text-red-500');
            b.classList.remove('text-orange-500', 'text-green-600');
        } else if (b.textContent.trim() === 'Pending') {
            b.classList.add('text-orange-500');
            b.classList.remove('text-red-500', 'text-green-600');
        } else if (b.textContent.trim() === 'Selesai') {
            b.classList.add('text-green-600');
            b.classList.remove('text-red-500', 'text-orange-500');
        }
    });
    btn.classList.remove('border-blue-600', 'border-2');
    btn.classList.add('border-blue-700', 'border-4');
}

function setEditStatus(status, btn) {
    document.getElementById('editStatus').value = status;
    Array.from(btn.parentNode.children).forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white');
        b.classList.add('bg-white', 'text-blue-600');
    });
    btn.classList.remove('bg-white', 'text-blue-600');
    btn.classList.add('bg-blue-600', 'text-white');
    updateEditStatusBadge(status);
}

const statusList = ["Belum Selesai", "Berjalan", "Selesai"];
const statusColor = {
    "Belum Selesai": "text-red-500",
    "Berjalan": "text-orange-500",
    "Selesai": "text-green-600"
};

const statusIcons = {
    "Belum Selesai": "assets/icon/not-done-icon.svg",
    "Berjalan": "assets/icon/pending-icon.svg",
    "Selesai": "assets/icon/done-icon.svg"
};

const statusSvgColor = {
    "Belum Selesai": "filter-red",
    "Berjalan": "filter-orange", 
    "Selesai": "filter-green"
};

function toggleEditStatus() {
    const badge = document.getElementById('editStatusBadge');
    const current = document.getElementById('editStatus').value;
    let idx = statusList.indexOf(current);
    idx = (idx + 1) % statusList.length;
    const nextStatus = statusList[idx];
    document.getElementById('editStatus').value = nextStatus;
    updateEditStatusBadge(nextStatus);
}

function updateEditStatusBadge(status) {
    const badge = document.getElementById('editStatusBadge');
    badge.innerHTML = `
        <img src="${statusIcons[status]}" alt="${status}" class="h-4 w-4 ${statusSvgColor[status]}">
        <span>${status}</span>
    `;
    badge.className = `w-full border border-blue-600 px-3 py-2 rounded font-semibold text-center ${statusColor[status]} bg-white flex items-center justify-center gap-2`;
}

document.addEventListener('DOMContentLoaded', function() {});

document.getElementById('addTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        name: document.getElementById('taskName').value,
        course: document.getElementById('course').value,
        deadline: document.getElementById('deadline').value,
        status: document.getElementById('addStatus').value
    };
    tasks.push(newTask);
    saveTasks();
    closeModal('modalTambah');
    renderTasks();
    this.reset();
});

document.addEventListener('DOMContentLoaded', function() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    flatpickr("#deadline", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below"
    });
    flatpickr("#editDeadline", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below",
        time_24hr: true
    });
    flatpickr("#startDate", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below"
    });
    flatpickr("#endDate", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below"
    });
    renderTasks();
    updateAddStatusBadge(document.getElementById('addStatus').value);
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('addTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        name: document.getElementById('taskName').value,
        course: document.getElementById('course').value,
        deadline: document.getElementById('deadline').value,
        status: document.getElementById('addStatus').value
    };
    tasks.push(newTask);
    saveTasks();
    closeModal('modalTambah');
    renderTasks();
    this.reset();
});

document.getElementById('editTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = document.getElementById('editTaskId').value;
    tasks[idx] = {
        ...tasks[idx],
        name: document.getElementById('editTaskName').value,
        course: document.getElementById('editCourse').value,
        deadline: document.getElementById('editDeadline').value,
        status: document.getElementById('editStatus').value
    };
    saveTasks();
    closeModal('modalEdit');
    renderTasks();
});

function deleteTask() {
    const idx = document.getElementById('editTaskId').value;
    tasks.splice(idx, 1);
    saveTasks();
    closeModal('modalEdit');
    renderTasks();
}

let tasks = [
    { name: "Tugas 1", course: "Matematika", deadline: "2024-06-10T14:00", status: "Belum Selesai" },
    { name: "Tugas 2", course: "Fisika", deadline: "2024-06-15T09:30", status: "Selesai" },
    { name: "Tugas 3", course: "Kimia", deadline: "2024-06-20T23:59", status: "Berjalan" },
    { name: "Tugas 4", course: "Biologi", deadline: "2024-06-25T12:00", status: "Belum Selesai" },
    { name: "Tugas 5", course: "Sejarah", deadline: "2024-06-30T16:45", status: "Selesai" },
    { name: "Tugas 6", course: "Geografi", deadline: "2024-07-05T11:15", status: "Berjalan" }    
];

document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#deadline", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below"
    });
    flatpickr("#editDeadline", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below",
        time_24hr: true
    });
    flatpickr("#startDate", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below"
    });
    flatpickr("#endDate", {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i",
        altInput: true,
        altFormat: "d/m/y H:i",
        placeholder: "dd/mm/yy",
        allowInput: true,
        position: "below"
    });
});

let currentPage = 1;
const pageSize = 5;

function renderTasks() {
    const counts = {
        "Belum Selesai": 0,
        "Berjalan": 0,
        "Selesai": 0
    };
    
    tasks.forEach(task => {
        counts[task.status]++;
    });
    
    document.getElementById('notDoneCount').textContent = counts["Belum Selesai"];
    document.getElementById('pendingCount').textContent = counts["Berjalan"];
    document.getElementById('completedCount').textContent = counts["Selesai"];

    const tbody = document.getElementById('taskTableBody');
    const mobileTable = document.getElementById('taskMobileTable');
    tbody.innerHTML = "";
    mobileTable.innerHTML = "";

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let filteredTasks = [...tasks];
    
    // Apply search filter first
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(task => 
            task.name.toLowerCase().includes(searchQuery) || 
            task.course.toLowerCase().includes(searchQuery)
        );
    }
    
    // Apply date range filter if both dates are set
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Set end time to end of day for inclusive filtering
        end.setHours(23, 59, 59, 999);
        
        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.deadline);
            return taskDate >= start && taskDate <= end;
        });

        // Update URL with date filters
        const url = new URL(window.location);
        url.searchParams.set('startDate', startDate);
        url.searchParams.set('endDate', endDate);
        window.history.pushState({}, '', url);
    }

    const nameSort = document.querySelector('input[name="nameSort"]:checked')?.value;
    const courseSort = document.querySelector('input[name="courseSort"]:checked')?.value;
    const deadlineSort = document.querySelector('input[name="deadlineSort"]:checked')?.value;
    const statusFilter = document.querySelector('input[name="statusFilter"]:checked')?.value;

    if (statusFilter) {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }

    if (nameSort) {
        filteredTasks.sort((a, b) => {
            return nameSort === 'nameAsc' 
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
    }

    if (courseSort) {
        filteredTasks.sort((a, b) => {
            return courseSort === 'courseAsc'
                ? a.course.localeCompare(b.course)
                : b.course.localeCompare(a.course);
        });
    }

    if (deadlineSort) {
        filteredTasks.sort((a, b) => {
            return deadlineSort === 'deadlineAsc'
                ? new Date(a.deadline) - new Date(b.deadline)
                : new Date(b.deadline) - new Date(a.deadline);
        });
    }

    const totalPages = Math.ceil(filteredTasks.length / pageSize);
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filteredTasks.slice(start, end);

    if (pageItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center p-4">Tidak ada tugas</td></tr>`;
        mobileTable.innerHTML = `<div class="text-center p-4 text-gray-500">Tidak ada tugas</div>`;
        document.getElementById('taskPagination').innerHTML = '';
        return;
    }

    pageItems.forEach((task, idx) => {
        const deadlineFormatted = task.deadline.replace("T", " ");
        let statusClass = "w-full inline-block bg-white border border-blue-600 px-3 py-1 rounded font-semibold";
        let textClass = "";
        if (task.status === "Belum Selesai") textClass = "text-red-500";
        else if (task.status === "Selesai") textClass = "text-green-600"; 
        else if (task.status === "Berjalan") textClass = "text-orange-500";
        tbody.innerHTML += `
            <tr>
                <td class="p-4 border-r text-center">${start + idx + 1}</td>
                <td class="p-4 border-r text-center">${task.name}</td>
                <td class="p-4 border-r text-center">${task.course}</td>
                <td class="p-4 border-r text-center">${deadlineFormatted}</td>
                <td class="p-4 border-r text-center">
                    <span class="${statusClass} ${textClass} flex items-center justify-center gap-2">
                        <img src="${statusIcons[task.status]}" alt="${task.status}" class="h-4 w-4 ${statusSvgColor[task.status]}">
                        ${task.status}
                    </span>
                </td>
                <td class="p-4 text-center">
                    <button class="w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2" onclick="openEditTask(${getTaskIndex(task)})">
                        <img src="assets/icon/edit-icon.svg" alt="Edit" class="h-4 w-4 filter invert">
                        Edit
                    </button>
                </td>
            </tr>
        `;
    });

    pageItems.forEach((task, idx) => {
        const deadlineFormatted = task.deadline.replace("T", " ");
        let statusClass = "inline-block bg-white border border-blue-600 px-3 py-1 rounded font-semibold";
        let textClass = statusColor[task.status];

        mobileTable.innerHTML += `
            <div class="mobile-card">
                <div class="mobile-field">
                    <span class="mobile-label">No:</span>
                    <span class="mobile-value">${start + idx + 1}</span>
                </div>
                <div class="mobile-field">
                    <span class="mobile-label">Nama Tugas:</span>
                    <span class="mobile-value">${task.name}</span>
                </div>
                <div class="mobile-field">
                    <span class="mobile-label">Mata Kuliah:</span>
                    <span class="mobile-value">${task.course}</span>
                </div>
                <div class="mobile-field">
                    <span class="mobile-label">Deadline:</span>
                    <span class="mobile-value">${deadlineFormatted}</span>
                </div>
                <div class="mobile-field">
                    <span class="mobile-label">Status:</span>
                    <span class="mobile-value">
                        <span class="${statusClass} ${textClass} flex items-center gap-2">
                            <img src="${statusIcons[task.status]}" alt="${task.status}" class="h-4 w-4 ${statusSvgColor[task.status]}">
                            ${task.status}
                        </span>
                    </span>
                </div>
                <div class="mt-4 flex gap-2">
                    <button class="w-1/2 inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 gap-2 justify-center" onclick="deleteTask(${getTaskIndex(task)})">
                        <img src="assets/icon/delete-icon.svg" alt="Delete" class="h-4 w-4 filter invert">
                        Hapus
                    </button>
                    <button class="w-1/2 inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 gap-2 justify-center" onclick="openEditTask(${getTaskIndex(task)})">
                        <img src="assets/icon/edit-icon.svg" alt="Edit" class="h-4 w-4 filter invert">
                        Edit
                    </button>
                </div>
            </div>
        `;
    });

    const pagDiv = document.getElementById('taskPagination');
    pagDiv.innerHTML = '';
    if (totalPages <= 1) return;

    let html = `
        <nav class="flex items-center justify-between">
            <div class="flex-1 flex items-center justify-between bg-blue-600 rounded-lg px-4 py-3 shadow-md">
                <div>
                    <p class="text-sm text-white">
                        Menampilkan
                        <span class="font-medium">${Math.min((currentPage - 1) * pageSize + 1, filteredTasks.length)}</span>
                        sampai
                        <span class="font-medium">${Math.min(currentPage * pageSize, filteredTasks.length)}</span>
                        dari
                        <span class="font-medium">${filteredTasks.length}</span>
                        hasil
                    </p>
                </div>
                <div>
                    <span class="relative z-0 inline-flex shadow-sm rounded-md">
                        ${currentPage > 1 ? `
                            <button type="button" class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-white rounded-l-md hover:bg-blue-700" onclick="gotoTaskPage(${currentPage - 1})">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                        ` : ''}

                        ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
                            <button type="button" 
                                class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white ${page === currentPage ? 'bg-blue-700' : 'hover:bg-blue-700'}"
                                onclick="gotoTaskPage(${page})">${page}</button>
                        `).join('')}

                        ${currentPage < totalPages ? `
                            <button type="button" class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-white rounded-r-md hover:bg-blue-700" onclick="gotoTaskPage(${currentPage + 1})">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        ` : ''}
                    </span>
                </div>
            </div>
        </nav>
    `;
    pagDiv.innerHTML = html;
}

function gotoTaskPage(page) {
    currentPage = page;
    renderTasks();
}

function getTaskIndex(task) {
    return tasks.findIndex(t => t.name === task.name && t.course === task.course && t.deadline === task.deadline && t.status === task.status);
}

document.addEventListener('DOMContentLoaded', renderTasks);

document.getElementById('startDate').addEventListener('change', renderTasks);
document.getElementById('endDate').addEventListener('change', renderTasks);

document.getElementById('filterComplete')?.addEventListener('change', renderTasks);
document.getElementById('filterPending')?.addEventListener('change', renderTasks);
document.getElementById('filterStatusPending')?.addEventListener('change', renderTasks);

function openEditTask(idx) {
    const task = tasks[idx];
    document.getElementById('editTaskId').value = idx;
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editCourse').value = task.course;
    const editDeadlinePicker = document.querySelector("#editDeadline")._flatpickr;
    editDeadlinePicker.setDate(task.deadline, true);
    document.getElementById('editStatus').value = task.status;
    updateEditStatusBadge(task.status);
    openModal('modalEdit');
}

document.getElementById('editTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = document.getElementById('editTaskId').value;
    tasks[idx] = {
        ...tasks[idx],
        name: document.getElementById('editTaskName').value,
        course: document.getElementById('editCourse').value,
        deadline: document.getElementById('editDeadline').value,
        status: document.getElementById('editStatus').value
    };
    saveTasks();
    closeModal('modalEdit');
    renderTasks();
});

function toggleAddStatus() {
    const badge = document.getElementById('addStatusBadge');
    const current = document.getElementById('addStatus').value;
    let idx = statusList.indexOf(current);
    idx = (idx + 1) % statusList.length;
    const nextStatus = statusList[idx];
    document.getElementById('addStatus').value = nextStatus;
    updateAddStatusBadge(nextStatus);
}

function updateAddStatusBadge(status) {
    const badge = document.getElementById('addStatusBadge');
    badge.innerHTML = `
        <img src="${statusIcons[status]}" alt="${status}" 
             class="h-4 w-4 ${statusSvgColor[status]}">
        <span>${status}</span>
    `;
    badge.className = `w-full border border-blue-600 px-3 py-2 rounded font-semibold text-center ${statusColor[status]} bg-white flex items-center justify-center gap-2`;
}

document.addEventListener('DOMContentLoaded', function() {
    updateAddStatusBadge(document.getElementById('addStatus').value);
});

function focusCalendar(id) {
    document.getElementById(id).focus();
}
document.getElementById('editTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = document.getElementById('editTaskId').value;
    tasks[idx] = {
        name: document.getElementById('editTaskName').value,
        course: document.getElementById('editCourse').value,
        deadline: document.getElementById('editDeadline').value,
        status: document.getElementById('editStatus').value
    };
    closeModal('modalEdit');
    renderTasks();
});

// Add CSS for SVG filters in style block
document.head.insertAdjacentHTML('beforeend', `
<style>
.filter-red { filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%); }
.filter-orange { filter: invert(77%) sepia(38%) saturate(5224%) hue-rotate(339deg) brightness(101%) contrast(101%); }
.filter-green { filter: invert(56%) sepia(63%) saturate(435%) hue-rotate(93deg) brightness(97%) contrast(88%); }
</style>
`);

async function clearBrowserCache() {
    try {
        localStorage.clear();
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(name => caches.delete(name))
            );
        }
        window.location.reload(true);
    } catch (err) {
        console.error('Error clearing cache:', err);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            renderTasks(); 
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    updateAddStatusBadge(document.getElementById('addStatus').value);
});

function focusCalendar(id) {
    document.getElementById(id).focus();
}
document.getElementById('editTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = document.getElementById('editTaskId').value;
    tasks[idx] = {
        name: document.getElementById('editTaskName').value,
        course: document.getElementById('editCourse').value,
        deadline: document.getElementById('editDeadline').value,
        status: document.getElementById('editStatus').value
    };
    closeModal('modalEdit');
    renderTasks();
});

// Add CSS for SVG filters in style block
document.head.insertAdjacentHTML('beforeend', `
<style>
.filter-red { filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%); }
.filter-orange { filter: invert(77%) sepia(38%) saturate(5224%) hue-rotate(339deg) brightness(101%) contrast(101%); }
.filter-green { filter: invert(56%) sepia(63%) saturate(435%) hue-rotate(93deg) brightness(97%) contrast(88%); }
</style>
`);

// Add clear cache function
async function clearBrowserCache() {
    try {
        // Clear localStorage
        localStorage.clear();
        
        // Clear application cache
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(name => caches.delete(name))
            );
        }
        
        // Reload the page
        window.location.reload(true);
    } catch (err) {
        console.error('Error clearing cache:', err);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            renderTasks(); 
        });
    });
});

// Add URL parameter handling for filters
function updateURLParams() {
    const url = new URL(window.location);
    
    // Get all active filters
    const nameSort = document.querySelector('input[name="nameSort"]:checked')?.value;
    const courseSort = document.querySelector('input[name="courseSort"]:checked')?.value;
    const deadlineSort = document.querySelector('input[name="deadlineSort"]:checked')?.value;
    const statusFilter = document.querySelector('input[name="statusFilter"]:checked')?.value;
    
    // Update URL params
    if (nameSort) url.searchParams.set('nameSort', nameSort);
    if (courseSort) url.searchParams.set('courseSort', courseSort);
    if (deadlineSort) url.searchParams.set('deadlineSort', deadlineSort);
    if (statusFilter) url.searchParams.set('status', statusFilter);
    
    // Update URL without reloading page
    window.history.pushState({}, '', url);
}

// Load filters from URL on page load
document.addEventListener('DOMContentLoaded', function() {
    const url = new URL(window.location);
    
    // Check for modal in URL
    const modalId = url.searchParams.get('modal');
    if (modalId) {
        openModal(modalId);
    }
    
    // Load filters from URL
    const nameSort = url.searchParams.get('nameSort');
    const courseSort = url.searchParams.get('courseSort');
    const deadlineSort = url.searchParams.get('deadlineSort');
    const statusFilter = url.searchParams.get('status');
    
    if (nameSort) document.querySelector(`input[name="nameSort"][value="${nameSort}"]`)?.click();
    if (courseSort) document.querySelector(`input[name="courseSort"][value="${courseSort}"]`)?.click();
    if (deadlineSort) document.querySelector(`input[name="deadlineSort"][value="${deadlineSort}"]`)?.click();
    if (statusFilter) document.querySelector(`input[name="statusFilter"][value="${statusFilter}"]`)?.click();
    
    // Add change listeners to all filter inputs
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateURLParams();
            renderTasks();
        });
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    const url = new URL(window.location);
    const modalId = url.searchParams.get('modal');
    
    // Close all modals first
    ['modalTambah', 'modalEdit', 'modalFilter'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('hidden');
    });
    
    // Open modal if in URL
    if (modalId) {
        openModal(modalId);
    }
});

// Debounce function to prevent too many renders
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Add real-time search filtering
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(function(e) {
        renderTasks();
    }, 300)); // 300ms delay for better performance
    
    // ...existing code...
});
