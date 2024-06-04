const BasicPage = () => {
  
  return <>
    <body className='h-100 bg-light'>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                <div className="container">
                  <a className="navbar-brand" href="/">Hexlet Chat</a>
                  <button type="button" className="btn btn-primary">Выйти</button>
                </div>
              </nav>
          </div>
          <div className="Toastify"></div>
        </div>
      </div>
    </body>
  </>
};

export default BasicPage;