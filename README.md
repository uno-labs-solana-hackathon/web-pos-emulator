# Web POS emulator

This project is a web application which emulates the work of the POS terminal (**for the purposes of the Solana hackathon**).

The POS emulator allows the "cashier" to do the following:
- to select products from the catalog and add them to the cart
- to make unauthorized purchases
- to authorize the buyer by his ID (address in the blockchain) and show buyer's bonuses info
- to show an unsigned account creation transaction for a new customer to be sent for signature to his mobile wallet (Figure 2)
- to accept back an account creation transaction for a new customer signed by their mobile wallet (Figure 2)
- to pay for the purchase with the buyer's bonuses - Figure 6 - (by sending to and receiving back a signed transaction to write off bonuses from the buyer's mobile wallet).

## Screen shots

Fig 1
![изображение](https://user-images.githubusercontent.com/6206939/109153757-be7b3280-7786-11eb-83d2-c0160fb4a5f6.png)

Fig 2
![изображение](https://user-images.githubusercontent.com/6206939/109638825-e8a66900-7b67-11eb-9a11-be02ed23194b.png)

Fig 3
![изображение](https://user-images.githubusercontent.com/6206939/109639158-4c309680-7b68-11eb-910a-112f7187f2e6.png)

Fig 4
![изображение](https://user-images.githubusercontent.com/6206939/109639317-771aea80-7b68-11eb-98bf-8cdad436aa45.png)

Fig 5
![изображение](https://user-images.githubusercontent.com/6206939/109639369-89952400-7b68-11eb-93c0-9da8781c7dd1.png)

Fig 6
![изображение](https://user-images.githubusercontent.com/6206939/109639531-bcd7b300-7b68-11eb-86c0-6831578ad74b.png)


## How to build and install

Please read the **./web-pos-emulator/README.md** file
