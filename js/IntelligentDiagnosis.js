function downloadIntelligentDiagnosisFile(){
    let a = document.createElement("a");
    a.href = "http://" + host + "/cms/download/IntelligentDiagnosis";
    a.click();
}
function launchIntelligentDiagnosisFile(){
    let a = document.createElement("a");
    a.href = "hust423://";
    a.click();
}