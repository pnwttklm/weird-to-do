"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Switch,
  Checkbox,
  Center,
} from "@chakra-ui/react";

type TodoItem = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  image: String | null | undefined;
};

interface ImageData {
  name: string;
  data: string; // Assuming base64 string here
}

export default function Home() {
  const [list, setList] = useState<TodoItem[]>([]);

  const [add, setAdd] = useState("");
  const handleChangeAdd = (event: any) => setAdd(event.target.value);

  function handleRemove(id: number) {
    setList(list.filter((item) => item.id != id));
  }

  function handleCheck(id: number) {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return {
          id: item.id,
          todo: item.todo,
          completed: !item.completed,
          userId: item.userId,
          image: item.image,
        };
      } else {
        return item;
      }
    });
    setList(updatedList);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [images, setImages] = useState<ImageData | null>(null);
  function newTodo() {
    setList([
      ...list,
      {
        id: list.length > 0 ? list[list.length - 1].id + 1 : 1,
        todo: add,
        completed: false,
        userId: 0,
        image: images?.data,
      },
    ]);
    setAdd("");
    onClose();
    setImages(null);
  }

  const [completedCount, setCompletedCount] = useState<number>(0);
  useEffect(() => {
    const completedItems = list.filter((item) => item.completed);
    setCompletedCount(completedItems.length);
  }, [list]);

  const exportListToFile = () => {
    const jsonData = JSON.stringify(list, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "weirdToDoList.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [editChecked, setEditChecked] = useState<boolean>(false);
  const handleEdit = () => {
    setEditChecked(!editChecked);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://dummyjson.com/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setList(data.todos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = async (event) => {
      if (!(event.target as HTMLInputElement).files) return;
      const file = (event.target as HTMLInputElement).files?.[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) return;
        const data = JSON.parse(event.target.result as string);
        setList(data);
      };
      reader.readAsText(file!);
    };
    fileInput.click();
  };

  const [selectedItem, setSelectedItem] = useState<TodoItem | undefined>();
  const [editTodo, setEditTodo] = useState<string | undefined>(
    selectedItem?.todo
  );
  const [imagesE, setImagesE] = useState<String | null | undefined>(selectedItem?.image);

  useEffect(() => {
    if (selectedItem) {
      setEditTodo(selectedItem.todo);
      setImagesE(selectedItem.image);
    } else {
      setEditTodo(undefined);
      setImagesE(null);
    }
  }, [selectedItem]);

  const handleChangeEdit = (event: any) => setEditTodo(event.target.value);

  const handleFileChangeE = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        const newImage: ImageData = {
          name: file.name,
          data: imageData,
        };
        setImagesE(newImage.data);
        localStorage.setItem('uploadedImages', JSON.stringify(newImage));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditItem = () => {
    const updatedList = list.map((item) => {
      if (item.id === selectedItem?.id) {
        return {
          id: item.id,
          todo: String(editTodo),
          completed: item.completed,
          userId: item.userId,
          image: imagesE,
        };
      } else {
        return item;
      }
    });
    setList(updatedList);
    setImages(null);
    setImagesE(null);
    onCloseE();
  };

  const {
    isOpen: isOpenE,
    onOpen: onOpenE,
    onClose: onCloseE,
  } = useDisclosure();

  const openModal = (id: number) => {
    setSelectedItem(list.find((item) => item.id === id));
    onOpenE();
  };

  function handleUp(id:number){
    const index = list.findIndex(item => item.id === id);
    if (index > 0) {
      const newList = [...list];
      const temp = newList[index];
      newList[index] = newList[index - 1];
      newList[index - 1] = temp;
      setList(newList);
    }
  };
  function handleDown(id:number){
    const index = list.findIndex(item => item.id === id);
    if (index < list.length - 1) {
      const newList = [...list];
      const temp = newList[index];
      newList[index] = newList[index + 1];
      newList[index + 1] = temp;
      setList(newList);
    }
  };

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        const newImage: ImageData = {
          name: file.name,
          data: imageData,
        };
        setImages(newImage);
        localStorage.setItem('uploadedImages', JSON.stringify(newImage));
      };
      reader.readAsDataURL(file);
    }
  };
  useState(() => {
    const uploadedImages = localStorage.getItem('uploadedImages');
    if (uploadedImages) {
      setImages(JSON.parse(uploadedImages));
    }
  });
  return (
    <>
      <h1>My To-Do List</h1>
      <h1>
        Completed: {completedCount}|{list.length}
      </h1>
      {editChecked && <h1>Edit Mode</h1>}
      <div className="flex flex-col">
        {list.map((item) => {
          return (
            <div key={item.id}>
              <Checkbox
                isChecked={item.completed}
                size="lg"
                colorScheme="green"
                onChange={() => handleCheck(item.id)}
              />
              {item.image && (
                    <Image
                    src={String(item.image)}
                    alt="Image"
                    width={100} 
                    height={100}
                  />
                  )}
              {item.id}
              {item.todo}
              {editChecked && (
                <>
                  <Button colorScheme={"red"} onClick={() => handleRemove(item.id)}>Remove</Button>
                  <Button onClick={() => openModal(item.id)}>Edit</Button>
                  <Button onClick={() => handleUp(item.id)}>Up</Button>
                  <Button onClick={() => handleDown(item.id)}>Down</Button>
                </>
              )}
            </div>
          );
        })}
      </div>
      <Button onClick={onOpen}>Add</Button>
      <Button onClick={exportListToFile}>Export List</Button>
      Edit Mode:{" "}
      <Switch
        colorScheme="teal"
        size="lg"
        checked={editChecked}
        onChange={() => handleEdit()}
      />{" "}
      {editChecked ? "On" : "Off"}
      <Button onClick={() => setList([])}>Clear List</Button>
      <Button onClick={fetchData}>Fetch Data</Button>
      <Button onClick={fetchImport}>Import To-Do</Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a New To-Do</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Enter a new to-do" onChange={handleChangeAdd} />
            <div>
                <Center className="flex flex-col mt-6">
                  <h1 className="text-xl">อัปโหลดรูป</h1>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id="fileInput"
                    accept="image/png, image/jpeg"
                  />
                  {images && (
                    <Image
                    src={String(images.data)}
                    alt="Image"
                    width={100} 
                    height={100}
                  />
                  )}
                </Center>
              </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={() => newTodo()}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal onClose={onCloseE} isOpen={isOpenE} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit To-Do</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder={selectedItem?.todo}
              value={editTodo}
              onChange={handleChangeEdit}
            />
            <div>
                <Center className="flex flex-col mt-6">
                  <h1 className="text-xl">อัปโหลดรูป</h1>
                  <input
                    type="file"
                    onChange={handleFileChangeE}
                    id="fileInput"
                    accept="image/png, image/jpeg"
                  />
                  {imagesE && (
                    <Image
                    src={String(imagesE)}
                    alt="Image"
                    width={100} 
                    height={100}
                  />
                  )}
                </Center>
              </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseE}>Close</Button>
            <Button onClick={handleEditItem}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
