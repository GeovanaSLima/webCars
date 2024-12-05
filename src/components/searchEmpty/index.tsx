import { Container } from "../container";
import carDealImg from "../../assets/img/car_deal.jpg";

export function SearchEmpty({ searchText } : { searchText: string }) {
  return(
    <Container>
      <div className="w-full flex justify-center items-center mt-6">
        <div className="w-4/5 bg-white rounded-md flex items-center justify-center flex-col p-8">
        <img src={carDealImg} alt="Carro não encontrado" className="w-3/5 mb-8" />
          <h1
            className="text-lg text-zinc-600 font-medium"
          >
            Não encontramos resultados para <strong className="text-zinc-700">{searchText}</strong>
          </h1>
          <p className="text-sm text-zinc-700">Tente pesquisar por outros modelos</p>

        </div>
      </div>
    </Container>
  )
}