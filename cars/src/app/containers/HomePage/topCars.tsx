import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { ICar } from "../../../typings/car";
import { Car } from "../../components/Car";
import Carousel, { Dots, slidesToShowPlugin} from "@brainhubeu/react-carousel"
import '@brainhubeu/react-carousel/lib/style.css'
import { useMediaQuery } from "react-responsive";
import { SCREENS } from "../../components/responsive";
import carService from "../../services/carService";
import { setTopCars } from "./slice";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { makeSelectTopCars } from "./selectors";
import { GetCars_cars } from "../../services/carService/__generated__/GetCars";
import { createSelector } from "reselect";



const TopCarsContainer = styled.div`
    ${tw`
        max-w-screen-lg
        w-full
        flex
        flex-col
        items-center
        justify-center
        pr-4
        pl-4
        md:pl-0
        md:pr-0
        mb-10
    `}
`

const Title = styled.h2`
    ${tw`
        text-xl
        lg:text-4xl
        text-black
        font-extrabold
    `}
`

const CarsContainer = styled.div`
    ${tw`
        w-full
        flex
        flex-wrap
        justify-center
        mt-7
        md:mt-10

    `}
`

const EmptyCars = styled.div`
  ${tw`
    w-full
    flex
    justify-center
    items-center
    text-sm
    text-gray-500
  `};
`;

const actionDispatch = (dispatch: Dispatch) => ({
  setTopCars: (cars: GetCars_cars[]) => dispatch(setTopCars(cars))
})

const stateSelector = createSelector(makeSelectTopCars, (topCars) => ({
  topCars
}))

export function TopCars(){



  const [current, setCurrent] = useState(0)

  const isMobile = useMediaQuery({ maxWidth: SCREENS.sm })


  const { topCars } = useSelector(stateSelector)
  const {setTopCars} = actionDispatch(useDispatch())


  console.log("Cars", topCars);

  const fetchTopCars = async () =>{
    const cars = await carService.getCars().catch((err)=>{
      console.log("EROR", err)
    })

    console.log("Cars:", cars)
    if(cars) setTopCars(cars)
  }

  
  useEffect(()=>{
    fetchTopCars()
  }, [])

  const isEmptyTopCars = !topCars || topCars.length === 0

  
  const cars = (!isEmptyTopCars && topCars.map((car) => <Car {...car} thumbnailSrc={car.thumbnailUrl}/> )) || []

  const numberOfDots = isMobile ? cars.length : Math.ceil(cars.length / 3);


    return <TopCarsContainer>
         <Title>Explore Our Top Deals</Title>
         {isEmptyTopCars && <EmptyCars>No Cars To Show!</EmptyCars>}
        {!isEmptyTopCars && <CarsContainer>
           <Carousel 
              value={current} 
              onChange={setCurrent} 
              slides={cars}
              plugins={[
                "clickToChange",
                {
                  resolve: slidesToShowPlugin,
                  options: {
                    numberOfSlides: 3,
                  }
                },
              ]}
              breakpoints={{
                640: {
                  plugins: [
                    {
                      resolve: slidesToShowPlugin,
                      options: {
                        numberOfSlides: 1
                      }
                    },
                  ]
                },
                900: {
                  plugins: [
                    {
                      resolve: slidesToShowPlugin,
                      options: {
                        numberOfSlides: 2
                      }
                    },
                  ]
                }
              }}
           /> 

          <Dots value={current} onChange={setCurrent} number={numberOfDots} />
           
        </CarsContainer> }
    </TopCarsContainer>
}