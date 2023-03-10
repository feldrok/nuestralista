import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { getServerAuthSession } from "../server/auth";
import { Listbox, Menu, Popover, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

import { api } from "../utils/api";
import React, { Fragment, useState } from "react";
import { Item } from "@prisma/client";

export const getServerSideProps = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const session = await getServerAuthSession({ req, res });
  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

const Home: NextPage = () => {
  const [selected, setSelected] = useState<Item | null>(null);
  const [listInput, setListInput] = useState<string>("");
  const { data: session } = useSession();
  const { data: lists } = api.lists.getAll.useQuery();
  const { mutate: addList } = api.lists.addList.useMutation({
    onSuccess: async () => {
      setListInput("");
      await api.useContext().lists.getAll.invalidate();
    },
  });
  const { mutate: updateItem } = api.items.updateItem.useMutation({
    onSuccess: async () => {
      await api.useContext().items.getAll.invalidate();
    },
  });
  const { mutate: deleteItem } = api.items.deleteItem.useMutation({
    onSuccess: async () => {
      await api.useContext().items.getAll.invalidate();
    },
  });
  const { data: items, isLoading } = api.items.getAll.useQuery({
    listId: selected?.id || "",
  });

  return (
    <>
      <Head>
        <title>Nuestra Lista</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex items-center justify-between bg-black p-4">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button>
            <Image
              src={`${session?.user.image as string}`}
              alt="Avatar"
              className="rounded-full"
              width={40}
              height={40}
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-200" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => void signOut()}
                  >
                    Cerrar sesión
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <div className="flex gap-2">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
              <Listbox.Button className="relative w-56 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm">
                <span className="block">
                  {selected !== null ? selected.name : "No list selected"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {lists?.map((list, listIdx) => (
                  <Listbox.Option
                    key={listIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-gray-100" : "text-gray-900"
                      }`
                    }
                    value={list}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {list.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <Popover className={"relative"}>
            <Popover.Button className="flex h-full w-8 items-center justify-center rounded-lg bg-white">
              <PlusIcon className="h-5 w-5 text-gray-800" />
            </Popover.Button>
            <Popover.Panel className="absolute right-0 z-10 mt-3 ">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <form
                  onSubmit={() => addList({ name: listInput })}
                  className="flow-root rounded-md bg-white p-4 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                >
                  <input
                    type="text"
                    onChange={(e) => setListInput(e.target.value)}
                    className="outline-none"
                    placeholder="Nueva lista"
                  />
                </form>
              </div>
            </Popover.Panel>
          </Popover>
        </div>
      </nav>
      <main className="min-h-screen bg-black pt-4">
        <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 rounded-xl p-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            items?.map((item, itemIdx) => (
              <li
                key={itemIdx}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {
                      updateItem({
                        ...item,
                        checked: !item.checked,
                      });
                    }}
                  />
                  <span className="text-gray-800">{item.name}</span>
                </div>
                <button
                  onClick={() => {
                    deleteItem(item);
                  }}
                >
                  <TrashIcon className="h-5 w-5 text-gray-800" />
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex flex-col items-center gap-2"></div>
      </main>
    </>
  );
};

export default Home;
