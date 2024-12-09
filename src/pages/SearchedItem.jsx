import axios from "axios"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Header from "../comp/Header"
import { FaArrowCircleUp } from "react-icons/fa"
import CiteComp from "../comp/CiteComp"
import { firestoreKey } from "../firebase/FirebaseKey"
import IsUser from "../comp/IsUser"
import SignInModal from "../comp/SignInModal"
import SaveModal from "../comp/SaveModal"

import { collection, getDocs } from "firebase/firestore"

const SearchedItem = () => {
  const [data, setData] = useState([])

  const [user, setUser] = IsUser()

  const fetchData = async () => {
    const querySnapshot = await getDocs(
      collection(firestoreKey, "userCollectionOfSave")
    )
    const dataList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setData(dataList)
  }

  useEffect(() => {
    if (user) {
      fetchData() // Fetch data when user changes
    }
  }, [user, data])

  const [isChangePage, setISChangePage] = useState(false)
  const params = useParams()
  const location = useLocation()

  const [seeInput, setSeeInput] = useState(false)

  useEffect(() => {
    if (location?.pathname.includes("/search/")) {
      setSeeInput(true)
    } else {
      setSeeInput(false)
    }
  }, [location, seeInput])

  const [dataObject, setDataObject] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [noRes, setNoRes] = useState(false)

  useEffect(() => {
    if (!params?.query) {
      alert("No search value")
      return
    }
    const baseURL = "https://api.unpaywall.org/v2/search"
    const pageSize = 50
    const email = "unpaywall_01@gmail.com"

    async function fetchPage(query, page = 1) {
      try {
        setNoRes(false)
        const response = await axios.get(baseURL, {
          params: {
            query: query,
            email: email,
            page: params?.page && !isChangePage ? params?.page : page,
            pageSize: pageSize
          }
        })

        const { results, total_results } = response.data

        const totalPages = Math.ceil(total_results / pageSize)
        setDataObject(results)
        localStorage.setItem("savedObject", JSON.stringify(results))

        if (results.length === 0) {
          setNoRes(true)
        }

        if (!response) {
          alert("loading")
        }

        setTotalPages(totalPages)
        setCurrentPage(page)
      } catch (error) {
        console.error("Error fetching data:", error)
        throw error
      }
    }
    fetchPage(params.query, currentPage)
  }, [params?.query])

  const nav = useNavigate()

  const handlePageChange = page => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    setNoRes(true)
  }

  const controls = {
    canGoBack: currentPage > 1,
    canGoForward: currentPage < totalPages,

    goBack: () => {
      const page = params?.page ? parseInt(params.page) : 1
      const subtractOne = page - 1
      if (page === 1) {
        return
      }
      nav(`/search/${params?.query}/${subtractOne}`)
      handlePageChange(currentPage - 1)
      window.scrollTo(0, 0)
      setNoRes(true)
      setISChangePage(true)
    },
    goForward: () => {
      const page = params?.page ? parseInt(params.page) : 1
      const addedOne = page + 1
      handlePageChange(currentPage + 1)
      window.scrollTo(0, 0)
      setNoRes(true)
      nav(`/search/${params?.query}/${addedOne}`)
      setISChangePage(true)
    }
  }
  const [arr, setArr] = useState([])
  function pushArr(e, param) {
    e.stopPropagation()
    if (!arr.includes(param)) {
      setArr([...arr, param])
    }
  }
  function closeAuthors(e, param) {
    e.stopPropagation()
    if (arr.includes(param)) {
      setArr(arr.filter(item => item !== param))
    }
  }
  const [nextPage, setNextPage] = useState(true)
  useEffect(() => {
    if (!params?.query) {
      alert("No search value")
      return
    }
    const pageStr = params?.page || "1"
    const page = parseInt(pageStr)
    const baseURL = "https://api.unpaywall.org/v2/search"
    const pageSize = 50
    const email = "unpaywall_01@example.com"

    async function fetchPage(query, page) {
      try {
        setNoRes(false)
        const response = await axios.get(baseURL, {
          params: {
            query: query,
            email: email,
            page: page + 1,
            pageSize: pageSize
          }
        })
        const { results, total_results } = response.data
        const totalPages = Math.ceil(total_results / pageSize)
        setDataObject(results)
        if (results.length === 0) {
          setNoRes(true)
          setNextPage(false)
        } else {
          setNextPage(true)
        }
        setTotalPages(totalPages)
        setCurrentPage(page)
      } catch (error) {
        console.error("Error fetching data:", error)
        throw error
      }
    }
    fetchPage(params.query, page)
  }, [params?.query, params?.page, nextPage])

  const [filterVal, setFilterVal] = useState("")

  const [DateVal, setDateVal] = useState("")

  const [startYear, setStartYear] = useState(null)
  const [endYear, setEndYear] = useState(null)
  const [noFoundOnDate, setNoFoundOnDate] = useState(false)

  const [hearChanges, setHear] = useState(false)

  const handleYearSelection = year => {
    console.log("Filtering data with:", { year }) // Debug log

    const savedItem = localStorage.getItem("savedObject")
    const savedData = savedItem ? JSON.parse(savedItem) : dataObject

    if (!savedData || savedData.length === 0) {
      console.log("No data available for filtering.")
      return
    }

    const startYear = 2020
    const endYear = typeof year === "number" ? year : parseInt(year, 10)

    if (year != "Any Time") {
      const filteredByDate = savedData.filter(itm => {
        const itemYear = itm.response.year
        const updatedYear = new Date(itm.response.updated).getFullYear()

        // Check if either year falls within the range
        return (
          (itemYear >= startYear && itemYear <= endYear) ||
          (updatedYear >= startYear && updatedYear <= endYear)
        )
      })
      console.log("Filtered data:", filteredByDate) // Debug log

      // Only update state if there are results
      if (filteredByDate.length > 0) {
        setDataObject(filteredByDate)
        console.log("Data object updated with filtered data.")
      } else {
        console.log("No matching data found for the selected year.")
      }
    } else {
      setDataObject(savedData)
    }
  }

  const [slcVal, setSlcVal] = useState(0)

  function onchangeInput(params) {
    setSlcVal(params)
    handleYearSelection(params)
  }

  const [openCiteModal, setOpenCiteModal] = useState(false)

  const [citeDetails, setCiteDetails] = useState(null)

  const openModalWithDetails = (prmsBool, details) => {
    setCiteDetails(details)
    setOpenCiteModal(prmsBool)
  }

  const [openLogInModal, setOpenLogInModal] = useState(false)

  const [objToSave, setObjToSave] = useState(null)

  function closeSaveModal() {
    setOpenLogInModal(false)
    setObjToSave(null)
  }

  function isSaveData(paramItm) {
    if (user) {
      if (user.emailVerified) {
        if (paramItm != null) {
          setObjToSave(paramItm)
        } else {
          setOpenLogInModal(true)
        }
      } else {
        alert("not verified")
      }
    } else {
      setOpenLogInModal(true)

      if (paramItm != null) {
        setObjToSave(paramItm)
      }
    }
  }

  useEffect(() => {
    if (user != null) {
      setOpenLogInModal(false)
    }
  }, [openLogInModal, user])

  const isItemSaved = response => {
    return data?.some(userItem => {
      if (userItem.Uid === user?.uid) {
        if (userItem?.MyCollection) {
          return userItem?.MyCollection.some(collectionItem => {
            if (collectionItem.Link === response.doi_url) {
              return true
            }
            return false
          })
        }
      }
      return false
    })
  }

  return (
    <div className="h-auto">
      {objToSave && user?.emailVerified && (
        <div
          onClick={() => {
            closeSaveModal()
          }}
          className="custom-pos h-[100dvh] z-[200000000] items-center flex justify-center"
        >
          <div
            onClick={e => {
              e.stopPropagation()
            }}
            className="max-w-[400px] w-full"
          >
            <SaveModal
              objectItem={objToSave && objToSave}
              closer={setObjToSave}
            />
          </div>
        </div>
      )}
      {openLogInModal && !user && (
        <div
          onClick={() => {
            setOpenLogInModal(false)
          }}
          className="custom-pos h-[100dvh] z-[200000000] items-center flex justify-center"
        >
          <div
            className="max-w-[400px] w-full"
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <SignInModal isDataSave={true} />
          </div>
        </div>
      )}
      <Header inputSee={true} bookSee={false} locString={"Article"} />
      {openCiteModal && citeDetails && (
        <CiteComp closer={setOpenCiteModal} citeDetails={citeDetails} />
      )}
      <div className="mt-[80px] w-full h-[50px] border-b-[1px] border-b-[#e6e6e6] flex items-center justify-start px-3 font-semibold md:px-7 " >
        <div className="w-full max-w-[800px] flex justify-between items-center gap-[80px] md:justify-start md:max-w-[100%]">
          <div className="hidden md:block">Articles</div>
          <div className="text-[12px] text-left text-white">
            {dataObject != null && dataObject.length} resuls for "
            {params?.query}"
          </div>
          <div className="flex sm:hidden ">
            <select
              className="outline-none bg-[#e6e6e6] rounded-md text-black"
              value={slcVal}
              onChange={e => {
                onchangeInput(parseInt(e.target.value))
              }}
            >
              <option value="">YEAR</option>
              <option value="2024">Any Time</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
        </div>
      </div>
      <section className="flex w-full h-auto px-4 pt-6 gap-[50px] items-start">
        <div className="hidden border-b-[1px] border-b-[#e6e6e6 h-auto pb-2  md:block">
          <select
            value={filterVal}
            onChange={e => {
              setFilterVal(e.target.value)
            }}
            className="bg-[#e6e6e6]  py-1 px-2 rounded-lg text-black"
          >
            <option value="" className="text-black">Filter by</option>
            <option value="Date" className="text-black">Date</option>
          </select>
          {filterVal === "Date" && (
            <div className="text-left pl-1 pt-2 flex flex-col gap-1">
              {[2024, 2023, 2022, 2021, 2020, "Any Time"].map(year => (
                <div
                  key={year}
                  onClick={() => handleYearSelection(year)}
                  className="cursor-pointer text-white text-[13px] hover:underline hover:text-blue-400 "
                >
                  Since {year}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 w-full justify-start items-start over">
          {dataObject.length === 0 && noRes && (
            <div className="">No Results, try searching other words</div>
          )}
          {dataObject.length === 0 && !noRes && (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 44 44"
                stroke="#000"
              >
                <g fill="none" fill-rule="evenodd" stroke-width="2">
                  <circle cx="22" cy="22" r="1">
                    <animate
                      attributeName="r"
                      begin="0s"
                      dur="1.8s"
                      values="1; 20"
                      calcMode="spline"
                      keyTimes="0; 1"
                      keySplines="0.165, 0.84, 0.44, 1"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      begin="0s"
                      dur="1.8s"
                      values="1; 0"
                      calcMode="spline"
                      keyTimes="0; 1"
                      keySplines="0.3, 0.61, 0.355, 1"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="22" cy="22" r="1">
                    <animate
                      attributeName="r"
                      begin="-0.9s"
                      dur="1.8s"
                      values="1; 20"
                      calcMode="spline"
                      keyTimes="0; 1"
                      keySplines="0.165, 0.84, 0.44, 1"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      begin="-0.9s"
                      dur="1.8s"
                      values="1; 0"
                      calcMode="spline"
                      keyTimes="0; 1"
                      keySplines="0.3, 0.61, 0.355, 1"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </svg>
            </div>
          )}

          {dataObject.map((itm, index) => (
            <div
              key={index}
              onClick={() => {
                window.open(itm.response.doi_url, "_blank")
              }}
              className="flex flex-col justify-start items-start border-b-[.1px] border-b-[#e6e6e6] pb-3 w-full max-w-[800px] overflow-hidden"
            >
              <div className="font-semibold text-left cursor-pointer">
                {itm.response.title}
              </div>
              <div className="text-blue-400 text-[14px] break-words underline-offset-2 underline">
                {itm.response.doi_url}
              </div>
              <div className="w-full flex  gap-1 pt-2 items-center">
                <span className="text-[#888] text-left text-[12px]">
                  publisher: {itm.response.publisher},
                  <span className="font-semibold text-[13px] pl-1">
                    {itm.response.year}
                  </span>
                </span>
              </div>
              <div className="text-[#888] text-left text-[12px]">
                genre: {itm.response.genre}
              </div>
              <div className="text-[#888] text-left text-[12px]">
                updated on: {itm.response.updated}
              </div>
              {itm.response.z_authors != null && (
                <div className="pt-3 flex gap-1 overflow-hidden">
                  <div className="text-white text-left text-[12px] font-semibold flex items-start justify-center">
                    authors:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {arr.includes(itm?.response?.doi_url)
                      ? itm.response?.z_authors?.map((authors, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-700 text-[13px] px-1 rounded-md w-auto break-words overflow-hidden"
                          >
                            {authors.family}, {authors?.given}
                          </div>
                        ))
                      : itm.response?.z_authors
                          ?.slice(0, 5)
                          .map((authors, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-700 text-[13px] px-1 rounded-md w-auto overflow-hidden items-center flex"
                            >
                              {authors.family}
                            </div>
                          ))}
                    {itm.response?.z_authors?.length > 5 && (
                      <>
                        {arr.includes(itm?.response?.doi_url) ? (
                          <div
                            onClick={e => {
                              closeAuthors(e, itm?.response?.doi_url)
                            }}
                            className="bg-gray-700 text-[13px] px-1 rounded-md text-white cursor-pointer"
                          >
                            close
                          </div>
                        ) : (
                          <div
                            onClick={e => {
                              pushArr(e, itm?.response?.doi_url)
                            }}
                            className="bg-gray-700 text-[13px] px-1 rounded-md text-white cursor-pointer"
                          >
                            see all
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              <div
                onClick={e => {
                  e.stopPropagation()
                }}
                className="flex gap-1 text-[13px] mt-2"
              >
                <div
                  onClick={() => {
                    openModalWithDetails(true, itm.response)
                  }}
                  className="bg-gray-700 text-[13px] px-4 py-2 rounded-md text-white cursor-pointer"
                >
                  Cite
                </div>
                {user &&
                data.some(userItem => {
                  const isSaved = isItemSaved(itm.response)
                  return isSaved
                }) ? (
                  <div
                    onClick={() => isSaveData(itm.response)}
                    className="bg-green-700 text-[13px] px-1 rounded-md text-white cursor-pointer"
                  >
                    Saved
                  </div>
                ) : (
                  <div
                    onClick={() => isSaveData(itm.response)}
                    className="bg-gray-700 text-[13px] px-4 py-2 rounded-md text-white cursor-pointer"
                  >
                    Save
                  </div>
                )}
              </div>
            </div>
          ))}

          {dataObject.length != 0 && (
            <>
              <div className="flex gap-2">
                <div
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className="h-[30px] text-gray-700 text-3xl flex items-center justify-center hover:text-gray-950 cursor-pointer"
                >
                  <FaArrowCircleUp />
                </div>

                {params?.page && parseFloat(params?.page) > 1 && (
                  <div className="flex gap-2">
                    <div
                      onClick={controls.goBack}
                      className="bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5  hover:bg-gray-950"
                    >
                      ({params?.page && parseFloat(params?.page) - 1}) prev page
                    </div>
                  </div>
                )}
                {nextPage && (
                  <div
                    onClick={controls.goForward}
                    className="bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5 hover:bg-gray-950"
                  >
                    next page ({params?.page && parseFloat(params?.page) + 1})
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default SearchedItem
