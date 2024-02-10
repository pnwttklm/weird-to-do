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
} from "@chakra-ui/react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type TodoItem = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};



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
        };
      } else {
        return item;
      }
    });
    setList(updatedList);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  function newTodo() {
    setList([
      ...list,
      {
        id: list.length > 0 ? list[list.length - 1].id + 1 : 1,
        todo: add,
        completed: false,
        userId: 0,
      },
    ]);
    setAdd("");
    onClose();
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
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

  return (
    <>
      <h1>My To-Do List</h1>
      <h1>
        Completed: {completedCount}:{list.length}
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
              {item.id}
              {item.todo}
              {editChecked && (
                <>
                  <Button onClick={() => handleRemove(item.id)}>Remove</Button>
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
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={() => newTodo()}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
