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
import {
  BsPen,
  BsChevronDown,
  BsChevronUp,
  BsFolder2Open,
  BsPlusCircleFill,
  BsTrash3,
  BsArrowDownCircle,
  BsXCircle,
  BsStars,
} from "react-icons/bs";

type TodoItem = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  image: String | null | undefined;
};

interface ImageData {
  name: string;
  data: string;
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
  const [imagesE, setImagesE] = useState<String | null | undefined>(
    selectedItem?.image
  );

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

  function handleUp(id: number) {
    const index = list.findIndex((item) => item.id === id);
    if (index > 0) {
      const newList = [...list];
      const temp = newList[index];
      newList[index] = newList[index - 1];
      newList[index - 1] = temp;
      setList(newList);
    }
  }
  function handleDown(id: number) {
    const index = list.findIndex((item) => item.id === id);
    if (index < list.length - 1) {
      const newList = [...list];
      const temp = newList[index];
      newList[index] = newList[index + 1];
      newList[index + 1] = temp;
      setList(newList);
    }
  }

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
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="px-96 p-24">
      <div className="flex flex-row justify-between">
        <h1 className="text-6xl font-extrabold">My To-Do List</h1>
        <h1 className="text-6xl font-extrabold">
          {list.length - completedCount}
        </h1>
      </div>
      <h1 className="">
        Completed: {completedCount}|{list.length}
      </h1>
      <div className="flex flex-row justify-between mt-6 mb-12 place-content-center">
        <div>
          Edit Mode:{" "}
          <Switch
            colorScheme="teal"
            size="lg"
            checked={editChecked}
            onChange={() => handleEdit()}
          />{" "}
          {editChecked ? "On" : "Off"}
        </div>
        <div>
          <Button onClick={fetchData} className="mr-3">
            <BsStars className="text-2xl" />
          </Button>
          <Button className="gap-3" onClick={fetchImport}>
            <BsFolder2Open className="text-xl" />
            Import
          </Button>
          <Button
            onClick={onOpen}
            className="rounded-full"
            rounded={"full"}
            bg={"[#FFFFFF00]"}
          >
            <BsPlusCircleFill className="text-4xl" />
          </Button>
        </div>
      </div>
      {editChecked && (
        <h1 className="bg-[#000000] text-white rounded-full px-3 py-2 font-extrabold w-32 text-center my-6">
          Edit Mode
        </h1>
      )}
      {list.length == 0 && (
        <Center className="flex flex-col text-[#b6b6b6] border-2 w-full h-64 shadow-2xl rounded-3xl ">
          <h1 className="text-3xl text-center font-bold">
            Your To-Do is Empty
          </h1>
          <h1 className="text-xl text-center">
            Try add a new To-Do by click + at the upper right.
          </h1>
          <h1 className="text-xl text-center">
            or if you have nothing to do{" "}
            <Button onClick={fetchData} bg={"#00000000"}>
              <BsStars className="text-2xl" />
            </Button>
          </h1>
        </Center>
      )}
      <div className="flex flex-col gap-1">
        {list.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-row bg-[#FFFFFF] shadow-2xl rounded-2xl p-3 justify-between content-center"
            >
              <div className="flex flex-row ">
                <Checkbox
                  isChecked={item.completed}
                  size="lg"
                  colorScheme="green"
                  onChange={() => handleCheck(item.id)}
                  className="mr-3"
                />
                {item.image && (
                  <Image
                    src={String(item.image)}
                    alt="Image"
                    width={100}
                    height={100}
                    className="rounded-xl w-16 h-16 mr-3"
                  />
                )}
                <h1 className="text-lg">{item.todo}</h1>
              </div>
              <div className="content-center">
                {editChecked && (
                  <div className="content-center">
                    <Button onClick={() => openModal(item.id)} gap={2} mr={3}>
                      <BsPen />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleUp(item.id)}
                      mr={1}
                      rounded={"full"}
                      paddingX={-1}
                    >
                      <BsChevronUp />
                    </Button>
                    <Button
                      onClick={() => handleDown(item.id)}
                      mr={3}
                      rounded={"full"}
                      paddingX={-1}
                    >
                      <BsChevronDown />
                    </Button>
                    <Button
                      colorScheme={"red"}
                      onClick={() => handleRemove(item.id)}
                      rounded={"full"}
                      paddingX={-1}
                    >
                      <BsTrash3 />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row justify-between mt-12">
        <Button onClick={exportListToFile} className="gap-3">
          <BsArrowDownCircle className="text-xl" />
          Export
        </Button>
        <Button onClick={() => setList([])} className="gap-3" colorScheme="red">
          <BsXCircle className="text-xl" />
          Clear List
        </Button>
      </div>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a New To-Do</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="Enter a new to-do" onChange={handleChangeAdd} />
            <div>
              <Center className="flex flex-col mt-6">
                <h1 className="text-xl">Upload an Image</h1>
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
            <div className="flex flex-row justify-between w-full">
              <Button onClick={onClose}>Close</Button>
              <Button onClick={() => newTodo()} colorScheme="teal">
                Add
              </Button>
            </div>
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
                <h1 className="text-xl">Upload an Image</h1>
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
            <div className="flex flex-row justify-between w-full">
              <Button onClick={onCloseE}>Close</Button>
              <Button onClick={handleEditItem} colorScheme="teal">
                Save
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
