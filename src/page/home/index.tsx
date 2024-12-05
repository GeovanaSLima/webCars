import { useEffect, useState } from "react";
import { useCarContext } from "../../context/CarContext";
import { Container } from "../../components/container";
import { CarGrid } from "../../components/carGrid";
import { SearchEmpty } from "../../components/searchEmpty";

export default function Home() {
  const { loadCars, searchCars, isLoading, cars } = useCarContext();
  const [searchQuery, setSearchQuery] = useState("");

  const hasResults = cars.length > 0;

  useEffect(() => {
    loadCars();
  }, []);

  const handleSearch = () => {
    searchCars(searchQuery);
  };

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Digite o nome do carro..."
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-primary-500 hover:bg-primary-600 transition-all h-9 px-8 rounded-lg text-white font-medium text-lg shadow-md"
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center my-10 text-2xl">
        Carros novos e usados em todo o Brasil
      </h1>

      {!isLoading && !hasResults ? (
        <SearchEmpty searchText={searchQuery} />
      ) : (
        <CarGrid />
      )}
    </Container>
  );
}
