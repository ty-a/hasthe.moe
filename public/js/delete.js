function deleteFile(file) {
  var request = new XMLHttpRequest();
  request.open("POST", '/delete/file/' + file, true);
  request.send();

  request.onreadystatechange = function() {
    if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var obj = JSON.parse(request.responseText);
      if(obj.status) {
        // success
        UIkit.notification({
          message: file + " deleted successfully",
          status: "success",
          position: "top-center"
        });
      } else {
        UIkit.notification({
          message: "Error: " + obj.reason,
          status:"danger",
          position: "top-center"
        })
      }


    }
  }
}
