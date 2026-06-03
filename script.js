let jobs =
JSON.parse(localStorage.getItem("jobs")) || [];

let chart;

function addJob(){

    const company =
    document.getElementById("company").value;

    const role =
    document.getElementById("role").value;

    const status =
    document.getElementById("status").value;

    if(!company || !role){
        alert("Fill all fields");
        return;
    }

    jobs.push({
        id:Date.now(),
        company,
        role,
        status
    });

    saveJobs();
    showToast("Job Added Successfully");
    renderJobs();

    document.getElementById("company").value="";
    document.getElementById("role").value="";
}

function renderJobs(){

    const search =
    document.getElementById("search")
    .value.toLowerCase();

    const jobList =
    document.getElementById("jobList");

    jobList.innerHTML="";

    const filteredJobs =
    jobs.filter(job =>
        job.company.toLowerCase()
        .includes(search)
    );

    filteredJobs.forEach(job=>{

        let statusClass =
        job.status.toLowerCase();

        jobList.innerHTML += `
        <div class="job-card">

            <h3>${job.company}</h3>

            <p><b>Role:</b> ${job.role}</p>

            <span class="status ${statusClass}">
                ${job.status}
            </span>

            <div class="action-buttons">

                <button
                    class="edit-btn"
                    onclick="editJob(${job.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteJob(${job.id})">
                    Delete
                </button>

            </div>

        </div>
        `;
    });

    updateDashboard();
    loadChart();
}

function editJob(id){

    const job =
    jobs.find(j=>j.id===id);

    const company =
    prompt(
        "Edit Company",
        job.company
    );

    const role =
    prompt(
        "Edit Role",
        job.role
    );

    if(company && role){
        job.company=company;
        job.role=role;

        saveJobs();
        renderJobs();
        showToast("Job Updated");
    }
}

function deleteJob(id){

    jobs =
    jobs.filter(job =>
        job.id!==id
    );

    saveJobs();
    renderJobs();
    showToast("Job Deleted");
}

function updateDashboard(){

    document.getElementById(
        "totalJobs"
    ).innerText = jobs.length;

    document.getElementById(
        "interviews"
    ).innerText =
    jobs.filter(j =>
        j.status==="Interview"
    ).length;

    document.getElementById(
        "selected"
    ).innerText =
    jobs.filter(j =>
        j.status==="Selected"
    ).length;
}

function saveJobs(){

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );
}

function toggleTheme(){

    document.body
    .classList.toggle("dark");
}

function showToast(message){

    const toast =
    document.getElementById("toast");

    toast.innerText=message;
    toast.style.opacity="1";

    setTimeout(()=>{
        toast.style.opacity="0";
    },2000);
}

function loadChart(){

    const ctx =
    document.getElementById(
        "jobChart"
    );

    const applied =
    jobs.filter(j =>
        j.status==="Applied"
    ).length;

    const interview =
    jobs.filter(j =>
        j.status==="Interview"
    ).length;

    const rejected =
    jobs.filter(j =>
        j.status==="Rejected"
    ).length;

    const selected =
    jobs.filter(j =>
        j.status==="Selected"
    ).length;

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"doughnut",
        data:{
            labels:[
                "Applied",
                "Interview",
                "Rejected",
                "Selected"
            ],
            datasets:[{
                data:[
                    applied,
                    interview,
                    rejected,
                    selected
                ]
            }]
        }
    })
