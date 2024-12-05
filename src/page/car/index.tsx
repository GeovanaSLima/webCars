import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { CarProps } from "../home";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { toast } from "react-toastify";

export default function CarDetail() {
  const [car, setCar] = useState<CarProps>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if(!id) { return; }

      const docRef = doc(db, "cars", id)

      getDoc(docRef)
      .then((snapshot) => {

        if(!snapshot.data()) {
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
          images: snapshot.data()?.images
        })
      })
    }

    loadCar()
  }, [id]) 

  
  return (
    <Container>
      { car && (
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Navigation]}
          breakpoints={{
            720: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
          }}
        >
          {car?.images.map( image => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className="w-full h-96 object-cover"/>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      { car && (
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
           href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, gostaria de saber mais detalhes sobre esse anúncio do ${car?.name} no WebCars`}
           target={"_blank"}
           className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-md font-medium cursor-pointer"
          >
            Conversar com vendedor
            <FaWhatsapp size={26} color="#FFF" />
          </a>

        </main>
      )}

    </Container>
  )
}
