import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { CarGrid } from "../../components/carGrid";
import { Container } from "../../components/container";
import { DashHeader } from "../../components/dashHeader";
import { useCarContext } from "../../context/CarContext";

export default function Dashboard() {
  const { user } = useAuthContext();
  const { loadUserCars } = useCarContext();

  useEffect(() => {
    if (user?.uid) {
      loadUserCars(user.uid);
    }
  }, [user]);

  return (
    <Container>
      <DashHeader />
      <CarGrid />
    </Container>
  );
}
