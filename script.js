// Function to update preview in real-time
function updatePreview() {
    const formInputs = {
        title: document.getElementById('title').value,
        course: document.getElementById('course').value,
        examYear: document.getElementById('examYear').value,
        courseCode: document.getElementById('courseCode').value,
        courseTitel: document.getElementById('courseTitel').value,
        studentId: document.getElementById('studentId').value,
        regNo: document.getElementById('regNo').value,
        session: document.getElementById('session').value,
        department: document.getElementById('department').value,
        institute: document.getElementById('institute').value
    };

    document.querySelector('.main-title').textContent = formInputs.title;
    document.querySelector('.course-name').textContent = formInputs.course;
    document.querySelector('.exam-title').textContent = `Practical Examination-${formInputs.examYear}`;
    document.getElementById('displayCourseCode').textContent = formInputs.courseCode;
    document.getElementById('displayCourseTitel').textContent = formInputs.courseTitel;
    document.getElementById('displayStudentId').textContent = formInputs.studentId;
    document.getElementById('displayRegNo').textContent = formInputs.regNo;
    document.getElementById('displaySession').textContent = formInputs.session;
    document.getElementById('displayDepartment').textContent = formInputs.department;
    document.getElementById('displayInstitute').textContent = formInputs.institute;
}

// Function to download image
function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Generate cover page as image
function generatePDF() {
    const element = document.getElementById('coverPage');
    const button = document.querySelector('.pdf-button');
    const originalText = button.innerHTML;

    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    button.disabled = true;

    // Capture the page
    html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Convert to image and download
        const imageData = canvas.toDataURL('image/png');
        downloadImage(imageData, 'practical-cover-page.png');

        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
    }).catch(error => {
        console.error('Image generation error:', error);
        button.innerHTML = originalText;
        button.disabled = false;
        alert('Failed to generate image. Please try again.');
    });
}

// Add event listeners to all input fields
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updatePreview);
});

// Initial preview update
window.addEventListener('load', updatePreview);
