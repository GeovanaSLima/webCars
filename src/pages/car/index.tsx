import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";
import { FaWhatsapp } from "react-icons/fa";
import { CarProps } from "../../context/CarContext";
import Slider from "react-slick";

export default function CarDetail() {
  const [car, setCar] = useState<CarProps>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) { return; }

      const docRef = doc(db, "cars", id);

      getDoc(docRef)
        .then((snapshot) => {
          if (!snapshot.data()) {
            navigate("/");
          }

          setCar({
            id: snapshot.id,
            name: snapshot.data()?.name,
            year: snapshot.data()?.year,
            city: snapshot.data()?.city,
            model: snapshot.data()?.model,
            uid: snapshot.data()?.uid,
            description: snapshot.data()?.description,
            price: snapshot.data()?.price,
            km: snapshot.data()?.km,
            whatsapp: snapshot.data()?.whatsapp,
            created: snapshot.data()?.created,
            owner: snapshot.data()?.owner,
            images: snapshot.data()?.images,
          });
        });
    }

    loadCar();
  }, [id]);

  return (
    <Container>
      {car && (
        <div className="min-h-0 min-w-0 relative">
          <Slider
            dots={true} 
            infinite={true} 
            speed={500} 
            slidesToShow={2} 
            slidesToScroll={1} 
            responsive={[
              {
                breakpoint: 720, 
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  infinite: true,
                },
              },
            ]}
          >
            {car?.images.map((image) => (
              <div key={image.name} className="px-2">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-96 object-cover px-2 lg:px-0"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">R$ {car?.price}</h1>
          </div>

          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <div className="my-4">
            <strong>Descrição</strong>
            <p className="mt-2">{car?.description}</p>
          </div>

          <strong>Telefone / Whatsapp</strong>
          <p>{car?.whatsapp}</p>

          <a
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, gostaria de saber mais detalhes sobre esse anúncio do ${car?.name} no WebCarros`}
            target={"_blank"}
            className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-md font-medium cursor-pointer"
          >
            Conversar com vendedor
            <FaWhatsapp size={26} color="#FFF" />
          </a>
        </main>
      )}
    </Container>
  );
}
