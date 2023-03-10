import { Popover, Transition } from "@headlessui/react";
import React, {
  type FormEventHandler,
  Fragment,
  type SetStateAction,
} from "react";

import { PlusIcon } from "@heroicons/react/20/solid";

export default function NewItem(props: {
  onSubmit: FormEventHandler;
  setFunction: React.Dispatch<SetStateAction<string>>;
  inputValue: string;
}) {
  return (
    <div className="absolute bottom-0 right-0 m-4">
      <Popover className={"relative"}>
        <Popover.Button className="rounded-xl bg-[rgb(77,91,190)] p-4 shadow-md hover:bg-[rgb(112,127,238)]">
          <PlusIcon className="h-6 w-6 text-white" />
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute bottom-16 right-0 z-10 ">
            <div className="overflow-hidden rounded-xl shadow-lg ">
              <form
                onSubmit={props.onSubmit}
                className="flow-root rounded-md bg-white p-4 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
              >
                <input
                  type="text"
                  onChange={(e) => props.setFunction(e.target.value)}
                  value={props.inputValue}
                  className="outline-none"
                  placeholder="Nuevo item"
                />
              </form>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
