import { PulseLoader } from "react-spinners";
import { Container } from "../container";

interface LoadingProps {
  loading: boolean
}

export function Loader({ loading }: LoadingProps) {
  return(

    <Container>
      <div className="w-full min-h-screen flex justify-center items-center">

        <PulseLoader
        color={"rgb(239 68 68)"}
        loading={loading}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
        />
      </div>
    </Container>
  )
}