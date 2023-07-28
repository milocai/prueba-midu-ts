import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { SortBy, User } from "./types.d";
import { UsersList } from "./components/UsersList";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const initialState = useRef<User[]>([]);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://randomuser.me/api?results=100")
      .then(async (response) => await response.json())
      .then((response) => {
        setUsers(response.results);
        initialState.current = response.results;
      })
      .catch((error) => console.log(error));
  }, []);

  const filteredUsers = useMemo(() => {
    return filterCountry !== null
      ? users.filter((user) =>
          user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase())
        )
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    switch (sorting) {
      case SortBy.NONE:
        return filteredUsers;

      case SortBy.COUNTRY:
        return [...filteredUsers].sort((a, b) =>
          a.location.country.localeCompare(b.location.country)
        );

      case SortBy.NAME:
        return [...filteredUsers].sort((a, b) =>
          a.name.first.localeCompare(b.name.first)
        );

      case SortBy.LAST:
        return [...filteredUsers].sort((a, b) =>
          a.name.last.localeCompare(b.name.last)
        );
    }
  }, [filteredUsers, sorting]);

  const handleColorRows = () => {
    setShowColors(!showColors);
  };

  const handleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleDeleteUser = (email: string) => {
    const newUsers = users.filter((user) => user.email !== email);
    setUsers(newUsers);
  };

  const handleReset = () => {
    setUsers(initialState.current);
  };

  const handleChangeSorting = (sort: SortBy) => {
    setSorting(sort);
  };

  return (
    <div className="App">
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={handleColorRows}>Colorear filas</button>
        <button onClick={handleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? "No ordenar por país"
            : "Ordenar por país"}
        </button>
        <button onClick={handleReset}>Recuperar estado</button>
        <input
          style={{ height: "100%" }}
          placeholder="Filtrar por país"
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        <UsersList
          changeSorting={handleChangeSorting}
          users={sortedUsers}
          showColors={showColors}
          deleteUser={handleDeleteUser}
        />
      </main>
    </div>
  );
}

export default App;
