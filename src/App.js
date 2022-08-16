import "./App.css";
import AddBook from "./AddBook";
import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchItems();
  });

  const fetchItems = () => {
    fetch(
      "https://bookstore-67590-default-rtdb.europe-west1.firebasedatabase.app/books/.json"
    )
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  // Add keys to the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((book, index) =>
      Object.defineProperty(book, "id", { value: keys[index] })
    );
    setBooks(valueKeys);
  };

  const addBook = (newBook) => {
    fetch(
      "https://bookstore-67590-default-rtdb.europe-west1.firebasedatabase.app/books/.json",
      {
        method: "POST",
        body: JSON.stringify(newBook),
      }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(
      `https://bookstore-67590-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" noWrap>
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div
        className="ag-theme-material"
        style={{ height: 400, width: 1200, margin: "auto" }}
      >
        <AgGridReact rowData={books}>
          <AgGridColumn sortable={true} filter={true} field="title" />
          <AgGridColumn sortable={true} filter={true} field="author" />
          <AgGridColumn sortable={true} filter={true} field="year" />
          <AgGridColumn sortable={true} filter={true} field="isbn" />
          <AgGridColumn sortable={true} filter={true} field="price" />
          <AgGridColumn
            headerName=""
            field="id"
            width={90}
            cellRendererFramework={(params) => (
              <IconButton
                onClick={() => deleteBook(params.value)}
                size="small"
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            )}
          />
        </AgGridReact>
      </div>
    </div>
  );
}

export default App;
