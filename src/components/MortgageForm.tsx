"use client";
import Image from "next/image";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { calculateOnlyInterstLoan, calculateRepaymentLoan } from "@/util";
enum MortgageType {
  Repayment,
  Interest,
  Null,
}

type Data = {
  value?: number;
  error: boolean;
};
type FormData = {
  amount: Data;
  years: Data;
  interest: Data;
  type: {
    value: MortgageType;
    error: boolean;
  };
};
type MortgageData = {
  mortgage?: number;
  total?: number;
};
const MortgageForm = () => {
  const [mortgageData, setMortgageData] = useState<MortgageData>(() => ({
    mortgage: undefined,
    total: undefined,
  }));
  const [formData, setFormData] = useState<FormData>({
    amount: {
      value: undefined,
      error: false,
    },
    years: {
      value: undefined,
      error: false,
    },
    interest: {
      value: undefined,
      error: false,
    },
    type: {
      value: MortgageType.Null,
      error: false,
    },
  });
  const mortgageEl = useRef<HTMLDivElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const formatNumberWithCommas = (number?: number) => {
    if (number === undefined || isNaN(number)) return "";
    return number.toLocaleString("en-UK"); // You can change "en-UK" to your preferred locale.
  };

  const setDataNumber = (
    e: ChangeEvent<HTMLInputElement>,
    name: keyof FormData
  ) => {
    e.preventDefault();
    const rawValue = e.target.value.replace(/,/g, "");
    const value = rawValue ? parseFloat(rawValue) : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: {
        value: value,
        error: !value, // Set error to true if value is undefined or 0
      },
    }));
  };

  const handleNumberInput = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
      "Home",
      "End",
      "Escape",
      ".",
      ",",
    ];
    const isNumber = /^[0-9]$/.test(e.key);

    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const setType = (e: MouseEvent<HTMLInputElement>, type: MortgageType) => {
    setFormData((prev) => ({
      ...prev,
      type: {
        value: type,
        error: false,
      },
    }));
  };

  const clearForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData({
      amount: {
        value: undefined,
        error: false,
      },
      years: {
        value: undefined,
        error: false,
      },
      interest: {
        value: undefined,
        error: false,
      },
      type: {
        value: MortgageType.Null,
        error: false,
      },
    });
  };

  const calculatePayment = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let error = false;
    if (!formData.amount.value) {
      setFormData((prev) => ({
        ...prev,
        amount: {
          value: undefined,
          error: true,
        },
      }));
      error = true;
    }
    if (!formData.interest.value) {
      setFormData((prev) => ({
        ...prev,
        interest: {
          value: undefined,
          error: true,
        },
      }));
      error = true;
    }
    if (!formData.years.value) {
      setFormData((prev) => ({
        ...prev,
        years: {
          value: undefined,
          error: true,
        },
      }));
      error = true;
    }
    if (formData.type.value === MortgageType.Null) {
      setFormData((prev) => ({
        ...prev,
        type: {
          value: MortgageType.Null,
          error: true,
        },
      }));
      error = true;
    }
    if (error) return;
    else if (formData.type.value === MortgageType.Interest) {
      setMortgageData(
        calculateOnlyInterstLoan(
          formData.amount.value!,
          formData.interest.value!,
          formData.years.value!
        )
      );
    } else if (formData.type.value === MortgageType.Repayment) {
      setMortgageData(
        calculateRepaymentLoan(
          formData.amount.value!,
          formData.interest.value!,
          formData.years.value!
        )
      );
    }
    setShouldScroll(true);
  };

  useEffect(() => {
    if (shouldScroll && mortgageEl.current) {
      mortgageEl.current.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false); // Reset the flag after scrolling
    }
  }, [shouldScroll, mortgageData]);
  return (
    <form
      className="md:rounded-3xl lg:rounded-3xl overflow-hidden flex flex-col md:flex-row lg:flex-row w-full md:w-auto lg:w-auto bg-white lg:absolute md:absolute top-[50%] left-[50%] md:translate-x-[-50%] lg:translate-x-[-50%] lg:translate-y-[-50%] md:translate-y-[-50%]"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <section className="bg-white py-7 px-6">
        <div className="flex items-start gap-2 md:justify-between flex-col md:flex-row">
          <h1 className="text-2xl font-medium">Mortgage Calculator</h1>
          <button className="text-blue-600 underline" onClick={clearForm}>
            Clear All
          </button>
        </div>
        <div className="flex flex-col mt-8">
          <label htmlFor="amount">Mortgage Amount</label>
          <div className="relative  group">
            <input
              type="text"
              name="amount"
              id="amount"
              onChange={(e) => setDataNumber(e, "amount")}
              onKeyDown={handleNumberInput}
              value={formatNumberWithCommas(formData.amount.value) ?? ""}
              className={` p-2 border-[1px] rounded-md w-full pl-12  ${
                formData.amount.error ? "border-red-500" : ""
              } focus:border-prime hover:border-lite-500 focus:outline-none transition-colors remove-arrow`}
            />
            <div
              className={` h-[calc(100%-2px)] px-3 flex justify-center items-center font-semibold text-xl absolute left-[1px] top-[50%] bg-lite-100 group-focus-within:bg-prime group-hover:group-focus-within:bg-prime  ${
                formData.amount.error ? "bg-red-500 text-white " : ""
              } translate-y-[-50%] rounded-l-md pointer-events-none transition-all`}
            >
              &#163;
            </div>
          </div>
          <p
            className={`
              text-sm mt-2 font-semibold ${
                formData.amount.error ? "block text-red-400" : "hidden"
              }`}
          >
            This field is required
          </p>
        </div>
        <br />
        <div className="gap-5 flex flex-col lg:flex-row md:flex-row">
          <div className="flex flex-col">
            <label htmlFor="years">Mortgage Term</label>
            <div className="relative group">
              <input
                type="text"
                name="years"
                id="years"
                onChange={(e) => setDataNumber(e, "years")}
                onKeyDown={handleNumberInput}
                value={formatNumberWithCommas(formData.years.value) ?? ""}
                className={`border-solid border-[1px] rounded-md p-2 remove-arrow hover:border-lite-500 hover:focus-within:border-prime focus-within:border-prime outline-none w-full lg:w-auto md:w-auto ${
                  formData.years.error ? "border-red-500" : ""
                }`}
              />
              <div
                className={`w-14 flex justify-center items-center h-[calc(100%-2px)] absolute right-[1px] top-[50%] bg-lite-100 group-focus-within:bg-prime group-hover:group-focus-within:bg-prime 
                 ${
                   formData.years.error ? "bg-red-500 text-white " : ""
                 }translate-y-[-50%] rounded-r-md pointer-events-none transition-all`}
              >
                years
              </div>
            </div>
            <p
              className={`
              text-sm mt-2 font-semibold ${
                formData.years.error ? "block text-red-400" : "hidden"
              }`}
            >
              This field is required
            </p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="interest">Interest Rate</label>
            <div className="relative group">
              <input
                type="text"
                name="interest"
                id="interest"
                onChange={(e) => setDataNumber(e, "interest")}
                onKeyDown={handleNumberInput}
                value={formatNumberWithCommas(formData.interest.value) ?? ""}
                className={`border-solid border-[1px] w-full lg:w-auto md:w-auto rounded-md p-2 remove-arrow hover:border-lite-500 outline-none hover:focus-within:border-prime focus-within:border-prime ${
                  formData.interest.error ? "border-red-500" : ""
                }`}
              />
              <div
                className={`w-10 flex justify-center items-center h-[calc(100%-2px)] absolute right-[1px] top-[50%] bg-lite-100 group-focus-within:bg-prime
                  ${
                    formData.interest.error ? "bg-red-500 text-white" : ""
                  } translate-y-[-50%] rounded-r-md pointer-events-none transition-all`}
              >
                &#37;
              </div>
            </div>
            <p
              className={`
              text-sm mt-2 font-semibold ${
                formData.interest.error ? "block text-red-400" : "hidden"
              }`}
            >
              This field is required
            </p>
          </div>
        </div>
        <br />
        <div>
          <h3>Mortgage Type</h3>
          <div className="rounded-md border-[1px] flex items-center my-2 hover:border-prime bg-white wrapper transition-all">
            <label htmlFor="repayment" className="w-3"></label>
            <input
              className="custom-radio"
              type="radio"
              name="type"
              onClick={(e) => setType(e, MortgageType.Repayment)}
              id="repayment"
              checked={formData.type.value === MortgageType.Repayment}
            />
            <label
              htmlFor="repayment"
              className="p-3 pl-4 w-full cursor-pointer"
            >
              Repayment
            </label>
          </div>
          <div className="rounded-md border-[1px] flex items-center hover:border-prime bg-white wrapper transition-all">
            <label htmlFor="Interest" className="w-3"></label>
            <input
              className="custom-radio"
              type="radio"
              name="type"
              id="Interest"
              onClick={(e) => setType(e, MortgageType.Interest)}
              checked={formData.type.value === MortgageType.Interest}
            />
            <label
              htmlFor="Interest"
              className="pl-4 w-full p-3 cursor-pointer"
            >
              Interest Only
            </label>
          </div>
          <p
            className={`
              text-sm mt-2 font-semibold ${
                formData.type.error ? "visible text-red-400" : "invisible"
              }`}
          >
            This field is required
          </p>
        </div>
        <div className="mt-6">
          <button
            onClick={(e) => calculatePayment(e)}
            type="button"
            className="bg-prime hover:bg-opacity-55 transition-all rounded-3xl flex gap-3 py-3 px-6"
          >
            <Image
              src={"/images/icon-calculator.svg"}
              width={24}
              height={24}
              alt=""
            />
            Calculate Repayments
          </button>
        </div>
      </section>
      <section className="bg-lite-900 bg-opacity-95 text-white md:rounded-r-2xl md:rounded-bl-[5rem] p-5 py-10 md:text-center lg:max-w-[25rem] lg:w-[36vw] md:w-[36vw]">
        <div
          ref={mortgageEl}
          className={mortgageData.mortgage ? "block" : "hidden"}
        >
          <h2 className="text-2xl">Your results</h2>
          <br />
          <p className="text-lite-300">
            Your results are shown blow based on the information you provided.To
            adjust the results, edit the form and click &#34;calculate
            repayments&#34; again.
          </p>
          <br />
          <div className="bg-lite-900  px-4 py-5 rounded-lg border-t-4 border-prime">
            <p className="text-lite-300 text-lg">Your monthly repayments</p>
            <div className="text-prime text-5xl pt-3">
              &#163;{formatNumberWithCommas(mortgageData.mortgage)}
            </div>
            <div className="h-[1px] w-full bg-lite-100 bg-opacity-50 my-3 "></div>
            <p className="text-lite-300 font-medium">
              Total you&#39;ll repay over the term
            </p>
            <div className="font-bold tracking-wider text-2xl">
              &#163;{formatNumberWithCommas(mortgageData.total)}
            </div>
          </div>
        </div>
        <div className={mortgageData.mortgage ? "hidden" : "block"}>
          <Image
            src={"/images/Illustration-empty.svg"}
            width={192}
            height={192}
            alt="Calculator Image"
            className="mx-auto"
          />
          <h2 className="text-2xl mb-3">Results shown here</h2>
          <p className="text-gray-300 text-sm">
            Complete the form and click &#34;calculate repayments&#34; to see
            what your monthly repayments would be.
          </p>
        </div>
      </section>
    </form>
  );
};

export default MortgageForm;
