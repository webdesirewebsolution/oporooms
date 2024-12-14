import Image from 'next/image'
import React from 'react'
import AuthButtons from './AuthButtons'
import { auth } from '@/auth'
import HeaderOption from './HeaderOption'
import { getUser } from '@/app/actions'
import { Session } from 'next-auth'
import DesktopHeader from './Header/DesktopHeader'
import Cities from './Header/Cities'
import Link from 'next/link'

const Header = async ({ }) => {
    const session = await auth()
    const user = await getUser(session as Session)

    const cities = [
        {
            "title": "Bangalore",
            "subCities": [
                {
                    "name": "Koramangala",
                    "placeId": "ChIJLfyY2E4UrjsRVq4AjI7zgRY",
                    "latitude": 12.9352403,
                    "longitude": 77.624532,
                    "city": "Bangalore"
                },
                {
                    "name": "Mg Road",
                    "placeId": "ChIJE7w9OYcWrjsRnj23UubIcIs",
                    "latitude": 12.9747306,
                    "longitude": 77.6094877,
                    "city": "Bangalore"
                },
                {
                    "name": "Rajaji Nagar",
                    "placeId": "ChIJxfW4DPM9rjsRKsNTG-5p_QQ",
                    "latitude": 12.9981732,
                    "longitude": 77.55304459999999,
                    "city": "Bangalore"
                },
                {
                    "name": "Indiranagar",
                    "placeId": "ChIJkQN3GKQWrjsRNhBQJrhGD7U",
                    "latitude": 12.9783692,
                    "longitude": 77.6408356,
                    "city": "Bangalore"
                },
                {
                    "name": "Jayanagar",
                    "placeId": "ChIJ2ddlZ5gVrjsRh1BOAaf-ors",
                    "latitude": 12.9308107,
                    "longitude": 77.58385770000001,
                    "city": "Bangalore"
                },
                {
                    "name": "Madiwala",
                    "placeId": "ChIJaay65lgUrjsR7RFSyHzHAh0",
                    "latitude": 12.9226373,
                    "longitude": 77.6174442,
                    "city": "Bangalore"
                },
                {
                    "name": "Yesvantpur Railway Station",
                    "placeId": "ChIJj0N-IWQ9rjsRxDxWEhcGs9E",
                    "latitude": 13.0250302,
                    "longitude": 77.53402419999999,
                    "city": "Bangalore"
                },
                {
                    "name": "Marathahalli",
                    "placeId": "ChIJVwkdVbQTrjsRGUkefteUeFk",
                    "latitude": 12.956924,
                    "longitude": 77.701127,
                    "city": "Bangalore"
                },
                {
                    "name": "Hsr Layout",
                    "placeId": "ChIJzW7cv5EUrjsRecj7OYRxMvI",
                    "latitude": 12.9121181,
                    "longitude": 77.6445548,
                    "city": "Bangalore"
                },
                {
                    "name": "All of Bangalore",
                    "placeId": "ChIJbU60yXAWrjsR4E9-UejD3_g",
                    "latitude": 12.9715987,
                    "longitude": 77.5945627,
                    "city": "Bangalore"
                }
            ]
        },
        {
            "title": "Chennai",
            "subCities": [
                {
                    "name": "Chennai Central Railway Station",
                    "placeId": "ChIJZWIhof9lUjoRFgkVYkVw7kc",
                    "latitude": 13.0832022,
                    "longitude": 80.27552519999999,
                    "city": "Chennai"
                },
                {
                    "name": "T Nagar",
                    "placeId": "ChIJcSPapVVmUjoR8ErwQ5f0VEk",
                    "latitude": 13.0417591,
                    "longitude": 80.2340761,
                    "city": "Chennai"
                },
                {
                    "name": "Ecr East Coast Road",
                    "placeId": "EjlTSCA0OSAmIEVhc3QgQ29hc3QgUmQsIFN1bmRhcmFtLCBUYW1pbCBOYWR1IDYxNDcwNCwgSW5kaWEiZiJkChQKEgmjtyMoJPn_OhGjZL6pfHPCExIUChIJo7cjKCT5_zoRo2S-qXxzwhMaFAoSCeXhvKaRCFM6ESKfSDVeJVDKGhQKEgndpp5Mb2FTOhElllp1MggPxSIKDbQ5MgYVNnlgLw",
                    "latitude": 10.3954868,
                    "longitude": 79.4851638,
                    "city": "Chennai"
                },
                {
                    "name": "Koyambedu",
                    "placeId": "ChIJoXMoCLJmUjoR-DEq5GBvK38",
                    "latitude": 13.0693568,
                    "longitude": 80.1948314,
                    "city": "Chennai"
                },
                {
                    "name": "Mount Road",
                    "placeId": "ChIJMd13yUdmUjoRpJdxEAXrLmU",
                    "latitude": 13.0425386,
                    "longitude": 80.247538,
                    "city": "Chennai"
                },
                {
                    "name": "Ramapuram",
                    "placeId": "ChIJ8YhZZ9RgUjoRtA2KU9MBmW4",
                    "latitude": 13.0317443,
                    "longitude": 80.1816719,
                    "city": "Chennai"
                },
                {
                    "name": "Porur",
                    "placeId": "ChIJUY9IkBthUjoRdDAzOzWhZZY",
                    "latitude": 13.0381896,
                    "longitude": 80.1565461,
                    "city": "Chennai"
                },
                {
                    "name": "Chennai Egmore Railway Station",
                    "placeId": "ChIJjdB5FAlmUjoRoDJ1gY9F3gk",
                    "latitude": 13.0777157,
                    "longitude": 80.2614456,
                    "city": "Chennai"
                },
                {
                    "name": "Anna Nagar",
                    "placeId": "ChIJm3EiiAdkUjoR4oGVuHcQoL0",
                    "latitude": 13.0849557,
                    "longitude": 80.2101342,
                    "city": "Chennai"
                },
                {
                    "name": "Velachery",
                    "placeId": "ChIJO1oG8p9dUjoRzDhAYBVQQ2Y",
                    "latitude": 12.9754605,
                    "longitude": 80.2207047,
                    "city": "Chennai"
                },
                {
                    "name": "All of Chennai",
                    "placeId": "ChIJYTN9T-plUjoRM9RjaAunYW4",
                    "latitude": 13.0843007,
                    "longitude": 80.2704622,
                    "city": "Chennai"
                }
            ]
        },
        {
            "title": "Delhi",
            "subCities": [
                {
                    "name": "Paharganj",
                    "placeId": "ChIJryEpHWr9DDkRU3gPfcxaDFc",
                    "latitude": 28.6456045,
                    "longitude": 77.21277839999999,
                    "city": "Delhi"
                },
                {
                    "name": "Karol Bagh",
                    "placeId": "ChIJ0y5AX5wCDTkRRtmdTCl0IZQ",
                    "latitude": 28.6550458,
                    "longitude": 77.1888201,
                    "city": "Delhi"
                },
                {
                    "name": "Janakpuri",
                    "placeId": "ChIJD00Ga7oEDTkRPmD-EvfNCfY",
                    "latitude": 28.621899,
                    "longitude": 77.08783849999999,
                    "city": "Delhi"
                },
                {
                    "name": "Dwarka, New Delhi",
                    "placeId": "ChIJ4cTuMZwaDTkRmsiky3Y5STk",
                    "latitude": 28.5822999,
                    "longitude": 77.0499762,
                    "city": "Delhi"
                },
                {
                    "name": "Mahipalpur",
                    "placeId": "ChIJQaf1FBUcDTkRqsUUa-_-X1Q",
                    "latitude": 28.5448686,
                    "longitude": 77.1281345,
                    "city": "Delhi"
                },
                {
                    "name": "Indira Gandhi International Airport",
                    "placeId": "ChIJiS0q_IUbDTkRne1DLBh2874",
                    "latitude": 28.5561437,
                    "longitude": 77.0999623,
                    "city": "Delhi"
                },
                {
                    "name": "Saket",
                    "placeId": "ChIJ3T8F3fDhDDkRnxNgWBpc2Zc",
                    "latitude": 28.5220971,
                    "longitude": 77.2101534,
                    "city": "Delhi"
                },
                {
                    "name": "Lajpat Nagar",
                    "placeId": "ChIJPSkdgK3jDDkR_Oh-dGYJc38",
                    "latitude": 28.5649034,
                    "longitude": 77.2403317,
                    "city": "Delhi"
                },
                {
                    "name": "New Delhi Railway Station",
                    "placeId": "ChIJBXs6ETz9DDkRFllm4f46kfg",
                    "latitude": 28.6428915,
                    "longitude": 77.2190894,
                    "city": "Delhi"
                },
                {
                    "name": "Rohini",
                    "placeId": "ChIJPYChRzoBDTkRL16Bd8SM--0",
                    "latitude": 28.73826769999999,
                    "longitude": 77.0822151,
                    "city": "Delhi"
                },
                {
                    "name": "All of Delhi",
                    "placeId": "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
                    "latitude": 28.6139298,
                    "longitude": 77.2088282,
                    "city": "Delhi"
                }
            ]
        },
        {
            "title": "Gurgaon",
            "subCities": [
                {
                    "name": "Sector 14",
                    "placeId": "ChIJ43GLZrIZDTkRChywSQhquuQ",
                    "latitude": 28.4710811,
                    "longitude": 77.0454144,
                    "city": "Gurgaon"
                },
                {
                    "name": "Sector 38",
                    "placeId": "ChIJD5079G4YDTkR6pQnKjMAmoc",
                    "latitude": 28.4346993,
                    "longitude": 77.0430483,
                    "city": "Gurgaon"
                },
                {
                    "name": "Huda City Center Metro",
                    "placeId": "ChIJ1TkoQu8YDTkRVXC88T9HJuU",
                    "latitude": 28.4592,
                    "longitude": 77.07248,
                    "city": "Gurgaon"
                },
                {
                    "name": "Golf Course Road",
                    "placeId": "ChIJgxO2IdcYDTkRIA_FH-R8-FM",
                    "latitude": 28.4693181,
                    "longitude": 77.0938457,
                    "city": "Gurgaon"
                },
                {
                    "name": "Sikanderpur",
                    "placeId": "ChIJ5RW5ESwZDTkRH_doz9NXTQU",
                    "latitude": 28.4794221,
                    "longitude": 77.1068059,
                    "city": "Gurgaon"
                },
                {
                    "name": "Guru Dronacharya Metro",
                    "placeId": "ChIJeQHIyywZDTkR-ZCt2j7U9jQ",
                    "latitude": 28.4819493,
                    "longitude": 77.10225179999999,
                    "city": "Gurgaon"
                },
                {
                    "name": "Gurgaon Bus Stand",
                    "placeId": "ChIJWYjjgtUZDTkRHkvG5ehfzwI",
                    "latitude": 28.4594965,
                    "longitude": 77.0266383,
                    "city": "Gurgaon"
                },
                {
                    "name": "Iffco Chowk",
                    "placeId": "ChIJWd929B0ZDTkRIoxkxd-mBFk",
                    "latitude": 28.47224,
                    "longitude": 77.0724,
                    "city": "Gurgaon"
                },
                {
                    "name": "Sector 83",
                    "placeId": "ChIJ6RwsQps9DTkRIaO2C02VrjQ",
                    "latitude": 28.3985667,
                    "longitude": 76.9646908,
                    "city": "Gurgaon"
                },
                {
                    "name": "All of Gurgaon",
                    "placeId": "ChIJWYjjgtUZDTkRHkvG5ehfzwI",
                    "latitude": 28.4594965,
                    "longitude": 77.0266383,
                    "city": "Gurgaon"
                }
            ]
        },
        {
            "title": "Hyderabad",
            "subCities": [
                {
                    "name": "Secunderabad  Railway Station",
                    "placeId": "ChIJt8fpPSGayzsRqpXqJU94fJU",
                    "latitude": 17.4337454,
                    "longitude": 78.50157420000001,
                    "city": "Hyderabad"
                },
                {
                    "name": "Gachibowli",
                    "placeId": "ChIJ387edqKTyzsR4kSTb57nEiw",
                    "latitude": 17.4400802,
                    "longitude": 78.3489168,
                    "city": "Hyderabad"
                },
                {
                    "name": "Ameerpet",
                    "placeId": "ChIJgzG0W8WQyzsRAyfuI1sTvBo",
                    "latitude": 17.4375084,
                    "longitude": 78.4482441,
                    "city": "Hyderabad"
                },
                {
                    "name": "Kukatpally",
                    "placeId": "ChIJPfRiAeyRyzsRSM9YQ_7GiDI",
                    "latitude": 17.4875418,
                    "longitude": 78.3953462,
                    "city": "Hyderabad"
                },
                {
                    "name": "Rajiv Gandhi International Airport",
                    "placeId": "ChIJRRvZsX-7yzsRUajqM-wpIFM",
                    "latitude": 17.2402827,
                    "longitude": 78.429358,
                    "city": "Hyderabad"
                },
                {
                    "name": "Begumpet",
                    "placeId": "ChIJT4Uo7aOQyzsRjBsvjJNLCCA",
                    "latitude": 17.4447068,
                    "longitude": 78.4663812,
                    "city": "Hyderabad"
                },
                {
                    "name": "Madhapur",
                    "placeId": "ChIJBbIB8liRyzsRG0GSd77nuxE",
                    "latitude": 17.4485835,
                    "longitude": 78.39080349999999,
                    "city": "Hyderabad"
                },
                {
                    "name": "Chanda Nagar",
                    "placeId": "ChIJi2raC_KSyzsRDBz3h0WgETQ",
                    "latitude": 17.4934113,
                    "longitude": 78.32779479999999,
                    "city": "Hyderabad"
                },
                {
                    "name": "LB Nagar",
                    "placeId": "ChIJkQLBra6YyzsR3ioiJ6p_Lm4",
                    "latitude": 17.3457176,
                    "longitude": 78.55222959999999,
                    "city": "Hyderabad"
                },
                {
                    "name": "Abids",
                    "placeId": "ChIJZ5b8pmKXyzsRJH0dp2SOldI",
                    "latitude": 17.393,
                    "longitude": 78.473,
                    "city": "Hyderabad"
                },
                {
                    "name": "All of Hyderabad",
                    "placeId": "ChIJx9Lr6tqZyzsRwvu6koO3k64",
                    "latitude": 17.406498,
                    "longitude": 78.47724389999999,
                    "city": "Hyderabad"
                }
            ]
        },
        {
            "title": "Kolkata",
            "subCities": [
                {
                    "name": "Howrah Railway Station",
                    "placeId": "ChIJsbUi45N3AjoR9VdBHymQLiU",
                    "latitude": 22.5830002,
                    "longitude": 88.3372909,
                    "city": "Kolkata"
                },
                {
                    "name": "Kolkata International Airport",
                    "placeId": "ChIJA2nfWaqf-DkRg4tkQ0BEsQ0",
                    "latitude": 22.653564,
                    "longitude": 88.4450847,
                    "city": "Kolkata"
                },
                {
                    "name": "Chinar Park",
                    "placeId": "ChIJa-UgYi2e-DkRZFGaSVSypl8",
                    "latitude": 22.6249719,
                    "longitude": 88.43857109999999,
                    "city": "Kolkata"
                },
                {
                    "name": "Near Acropolis Mall",
                    "placeId": "ChIJWXBg61JxAjoRLNNVlZADVCY",
                    "latitude": 22.5149889,
                    "longitude": 88.3929766,
                    "city": "Kolkata"
                },
                {
                    "name": "Esplanade Metro Station",
                    "placeId": "ChIJ6eB8lKd3AjoR24BCZFOiiCo",
                    "latitude": 22.5649419,
                    "longitude": 88.35169870000001,
                    "city": "Kolkata"
                },
                {
                    "name": "Dum Dum Airport 1 No. Gate",
                    "placeId": "ChIJv3vaqEie-DkRxQZmcH9T6Ew",
                    "latitude": 22.6414351,
                    "longitude": 88.4309591,
                    "city": "Kolkata"
                },
                {
                    "name": "Barasat",
                    "placeId": "ChIJ7TwotQmi-DkReL1SBlp2iUk",
                    "latitude": 22.7247556,
                    "longitude": 88.4789351,
                    "city": "Kolkata"
                },
                {
                    "name": "Salt Lake City",
                    "placeId": "ChIJ7THRiJQ9UocRyjFNSKC3U1s",
                    "latitude": 40.7607793,
                    "longitude": -111.8910474,
                    "city": "Kolkata"
                },
                {
                    "name": "All of Kolkata",
                    "placeId": "ChIJZ_YISduC-DkRvCxsj-Yw40M",
                    "latitude": 22.5743545,
                    "longitude": 88.3628734,
                    "city": "Kolkata"
                }
            ]
        },
        {
            "title": "Mumbai",
            "subCities": [
                {
                    "name": "Andheri East",
                    "placeId": "ChIJMbHfQRu25zsRMazdY3UpaKY",
                    "latitude": 19.1178548,
                    "longitude": 72.8631304,
                    "city": "Mumbai"
                },
                {
                    "name": "Andheri West",
                    "placeId": "ChIJ3ZHYthi25zsRMtExx1eo-JE",
                    "latitude": 19.1364016,
                    "longitude": 72.8296252,
                    "city": "Mumbai"
                },
                {
                    "name": "Thane",
                    "placeId": "ChIJWf12_vy45zsRgwLF94V9Ns8",
                    "latitude": 19.2183307,
                    "longitude": 72.9780897,
                    "city": "Mumbai"
                },
                {
                    "name": "Chhatrapati Shivaji International Airport",
                    "placeId": "ChIJRym9mVDI5zsRrqh0xGAazB4",
                    "latitude": 19.0902177,
                    "longitude": 72.86281199999999,
                    "city": "Mumbai"
                },
                {
                    "name": "Saki Naka",
                    "placeId": "ChIJUfCyPHfI5zsRNGsjRMlqV0A",
                    "latitude": 19.0961829,
                    "longitude": 72.88774219999999,
                    "city": "Mumbai"
                },
                {
                    "name": "Bandra",
                    "placeId": "ChIJe9L4I-HI5zsReGojmrSWeUM",
                    "latitude": 19.0595596,
                    "longitude": 72.8295287,
                    "city": "Mumbai"
                },
                {
                    "name": "Colaba",
                    "placeId": "ChIJlcIOo5rR5zsRzws9zlvdtxs",
                    "latitude": 18.9067031,
                    "longitude": 72.8147123,
                    "city": "Mumbai"
                },
                {
                    "name": "Bandra Kurla Complex",
                    "placeId": "ChIJG-qGC9_I5zsRlvK9G0vqfs4",
                    "latitude": 19.0687893,
                    "longitude": 72.87026469999999,
                    "city": "Mumbai"
                },
                {
                    "name": "Mumbai Cst Railway Station",
                    "placeId": "ChIJV0NWKWvR5zsR-dCNJr2Df8w",
                    "latitude": 18.9401131,
                    "longitude": 72.8357207,
                    "city": "Mumbai"
                },
                {
                    "name": "Navi Mumbai",
                    "placeId": "ChIJrRMfuPC55zsRafiFEWj3Ejw",
                    "latitude": 19.0330488,
                    "longitude": 73.0296625,
                    "city": "Mumbai"
                },
                {
                    "name": "All of Mumbai",
                    "placeId": "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
                    "latitude": 19.0759837,
                    "longitude": 72.8776559,
                    "city": "Mumbai"
                }
            ]
        },
        {
            "title": "Noida",
            "subCities": [
                {
                    "name": "Sector 62",
                    "placeId": "ChIJn23zbkXlDDkRyDZhKLGRcTs",
                    "latitude": 28.627981,
                    "longitude": 77.3648567,
                    "city": "Noida"
                },
                {
                    "name": "Sector 18",
                    "placeId": "ChIJD0ehLE_kDDkRM7S_bFuQ_4w",
                    "latitude": 28.570317,
                    "longitude": 77.3218196,
                    "city": "Noida"
                },
                {
                    "name": "Greater Noida",
                    "placeId": "ChIJ75r4uGTqDDkRLpYXU7vKDOw",
                    "latitude": 28.4743879,
                    "longitude": 77.50399039999999,
                    "city": "Noida"
                },
                {
                    "name": "Khora Colony",
                    "placeId": "ChIJUbHUWjzlDDkRq86ACGOdrFc",
                    "latitude": 28.6155722,
                    "longitude": 77.3467996,
                    "city": "Noida"
                },
                {
                    "name": "Noida City Centre",
                    "placeId": "ChIJezVzMaTlDDkRP8B8yDDO_zc",
                    "latitude": 28.5355161,
                    "longitude": 77.3910265,
                    "city": "Noida"
                },
                {
                    "name": "Sector 58",
                    "placeId": "ChIJEXAa8WzlDDkRI_qCy2pX10k",
                    "latitude": 28.6067511,
                    "longitude": 77.3597194,
                    "city": "Noida"
                },
                {
                    "name": "Sector 55",
                    "placeId": "ChIJkbSSCRHlDDkRMI41czIj9yo",
                    "latitude": 28.6049178,
                    "longitude": 77.3489877,
                    "city": "Noida"
                },
                {
                    "name": "Sector 15 Noida",
                    "placeId": "ChIJp7jMPl7kDDkRuuYZK-Zg69U",
                    "latitude": 28.5820607,
                    "longitude": 77.3109035,
                    "city": "Noida"
                },
                {
                    "name": "Sec 62 Fortis Hospital",
                    "placeId": "ChIJQ3BByZ3uDzkRpGjLqyoW1PE",
                    "latitude": 30.6962716,
                    "longitude": 76.73227349999999,
                    "city": "Noida"
                },
                {
                    "name": "All of Noida",
                    "placeId": "ChIJezVzMaTlDDkRP8B8yDDO_zc",
                    "latitude": 28.5355161,
                    "longitude": 77.3910265,
                    "city": "Noida"
                }
            ]
        },
        {
            "title": "Pune",
            "subCities": [
                {
                    "name": "Hadapsar",
                    "placeId": "ChIJ6arxgf_pwjsRU4usVTU0YCU",
                    "latitude": 18.508934,
                    "longitude": 73.92591019999999,
                    "city": "Pune"
                },
                {
                    "name": "Viman Nagar",
                    "placeId": "ChIJtYQU5kbBwjsRsLO0qPcsSLY",
                    "latitude": 18.5678553,
                    "longitude": 73.9143637,
                    "city": "Pune"
                },
                {
                    "name": "Pimpri Chinchwad",
                    "placeId": "ChIJs-q9fze4wjsR-KCnsdplQiw",
                    "latitude": 18.6297811,
                    "longitude": 73.7997094,
                    "city": "Pune"
                },
                {
                    "name": "Shivaji Nagar",
                    "placeId": "ChIJew2g0GMWrjsRpH4gRbkDGEI",
                    "latitude": 12.9856503,
                    "longitude": 77.60569269999999,
                    "city": "Pune"
                },
                {
                    "name": "Wakad",
                    "placeId": "ChIJ7RtXr3q5wjsRc2anpWs0Zww",
                    "latitude": 18.6010921,
                    "longitude": 73.7641245,
                    "city": "Pune"
                },
                {
                    "name": "Chandan Nagar",
                    "placeId": "ChIJqZ8FXcCR-DkRdN4yaSRfbFE",
                    "latitude": 22.867114,
                    "longitude": 88.3674381,
                    "city": "Pune"
                },
                {
                    "name": "Swargate",
                    "placeId": "ChIJxRgZJxTAwjsRP01JDD_mPPo",
                    "latitude": 18.5018322,
                    "longitude": 73.8635912,
                    "city": "Pune"
                },
                {
                    "name": "Kharadi",
                    "placeId": "ChIJlaSLKMPDwjsRSgBjOmEz6Dg",
                    "latitude": 18.5538241,
                    "longitude": 73.9476689,
                    "city": "Pune"
                },
                {
                    "name": "Koregaon Park",
                    "placeId": "ChIJdRIqOE7AwjsR8s8t4TvuyB4",
                    "latitude": 18.5362084,
                    "longitude": 73.8939748,
                    "city": "Pune"
                },
                {
                    "name": "All of Pune",
                    "placeId": "ChIJARFGZy6_wjsRQ-Oenb9DjYI",
                    "latitude": 18.5204303,
                    "longitude": 73.8567437,
                    "city": "Pune"
                }
            ]
        },
        {
            "title": "All Cities",
            "subCities": []
        }
    ]

    return (
        <>
            <div className='w-full bg-white shadow border-b-2 border-slate-200'>
                <div className='py-5 flex justify-between items-center px-8'>
                    <Link href='/' className='w-[140px] h-[53px] relative'>
                        <Image src='/Images/logo.png' alt='Logo' fill objectFit='contain' />
                    </Link>
                    <DesktopHeader />
                    {/* <Menu /> */}

                    {session?.user?._id ? <HeaderOption user={user} /> : <AuthButtons />}
                </div>
            </div>
            <div className='w-full bg-[#f3f5f7] px-5 hidden lg:block z-[999]'>
                <ul className='flex w-full'>
                    {cities?.map((item) => (
                        <li key={item?.title} className='flex-1 flex items-center justify-center group py-4'>
                            <Cities item={item}>
                                {item?.title}
                            </Cities>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Header