import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodItemProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

type NewFoodItemProps = Omit<FoodItemProps, 'id'>


function Dashboard(){
  const [foods, setFoods] = useState<FoodItemProps[]>([]);
  const [editingFood, setEditingFood] = useState<FoodItemProps | any>({})
  const [editingModalOpen, setEditingModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    async function loadFoods(){
      const response = await api.get('/foods');

      setFoods(response.data)
    }

    loadFoods()
  }, [])

  const handleAddFood = async (food: NewFoodItemProps) => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodItemProps) => {
    if(editingFood && editingFood.id){
      return;
    }

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

    const handleEditFood = (food: FoodItemProps) => {
    setEditingFood(food);
    setEditingModalOpen(true)
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  const toggleModal = () => {

    setModalOpen(!modalOpen);
  }

  const toggleEditModal = () => {

    setEditingModalOpen(!editingModalOpen)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editingModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );

}

export default Dashboard;
