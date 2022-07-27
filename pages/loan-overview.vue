<template>
<div>
 
    <v-container>
       <v-row>
        <v-col cols="1" class="mt-10">
          <v-icon
            style="backgroundColor:rgba(238, 238, 238, 1; borderRadius:50%"
            size="60px"
            class="pa-2"
            color="#F94249"
          >
            mdi-cellphone
          </v-icon>
        </v-col>
        <v-col cols="9" class="mt-10">
          <h1>Loan Details</h1>
          <p>Manage Loan Request</p>
        </v-col>
        <v-spacer></v-spacer>
         <v-btn color="blue" dark class="mt-12 mr-6"
         @click="logout()">
      Logout
    </v-btn>
      </v-row>
      <v-card-text>
        <v-form ref="form" v-model="isValid">
          
          <v-divider></v-divider>
          <v-row class="pt-4">
            <v-col cols="12">
              <v-text-field
                dense
                outlined
                label="Name*"
                disabled
                v-model="name"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                dense
                outlined
                label="Amount*"
                type="number"
                min="1"
                v-model="amount"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-file-input
                chips
                label="Upload ID"
                prepend-icon="mdi-camera"
                accept="image/png, image/jpeg, image/bmp"
                dense
                outlined
                v-model="image"
                @change="onFileChange(image)"
              ></v-file-input>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-card class="text-center">
                <img
                  class=""
                  style="
                    width: 10%;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                  "
                  :src="imageUrl"
                  v-if="imageUrl"
                  contain
                  alt="No Image available !"
                /><v-divider> </v-divider> </v-card
            ></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-flex class="d-flex justify-end">
                <v-btn
                  v-if="!isUpdate"
                  elevation="0"
                  :disabled="!isValid"
                  color="blue"
                  dark
                  @click="saveLoanDetails()"
                >
                  <v-icon>mdi-plus-thick</v-icon>Create
                </v-btn>

                <v-btn
                  v-if="isUpdate"
                  elevation="0"
                  :disabled="!isValid"
                  color="blue"
                  dark
                  @click="UpdateLoanDetails()"
                >
                  <v-icon>mdi-plus-thick</v-icon>Update
                </v-btn>
              </v-flex>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-container>
         <v-row v-if="loading">
    <v-col>
      <!-- <h1>loading</h1> -->
      <v-row align="center" justify="center">
        <v-col cols="5">
          <v-progress-circular
            :size="100"
            :width="10"
            color="#FE696E"
            indeterminate
            v-bind:style="{ margin: '50%' }"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
    <!--============================-->
    <v-snackbar v-model="confirmaionSnackbar" :timeout="3000">
      <v-icon color="green">mdi-check-bold</v-icon>
      {{ responsesuccessMsg }}
    </v-snackbar>
    <v-snackbar v-model="errorSnackBar" :timeout="3000">
      <v-icon color="red">mdi-close</v-icon>
      {{ responseErrorMsg }}
    </v-snackbar>
    <v-snackbar v-model="validationErrorSnackbar" :timeout="3000">
      <v-icon color="red">mdi-close</v-icon>
      {{ validationErrorMessage }}
    </v-snackbar>
    <!--============================-->

  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
export default {
  data() {
    return {
      loading: false,
      validationErrorMessage: "",
      confirmaionSnackbar: false,
      validationErrorSnackbar: false,
      errorSnackBar: false,
      responsesuccessMsg: "",
      responseErrorMsg: "",
      isUpdate: false,
      loanid: null,
      isValid: false,
      user_id: null,
      name: "",
      amount: null,
      image: null,
      imageUrl: null,
      base64Image: "",
      payload: {
        name: null,
        amount: null,
        image: null,
      },
    };
  },
  async mounted() {
    this.getUserData();
  },

  methods: {

    logout(){
      this.$auth.logout();
 
      window.location.reload(true);
    },
    getUserData() {

      console.log(
        this.$auth.strategy.token.get(),
        this.$auth.strategy.token.get().replace("Bearer ", "")
      );
      var token = this.$auth.strategy.token.get().replace("Bearer ", "")
      const userData = jwt_decode(token);
     
      this.name = userData.name;
      this.user_id = userData.id;
      if (this.user_id) {
        this.getLoanData();
      }
    },

    async getLoanData() {
      const loanData = await this.$axios.$get(`/users/${this.user_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

     
      if (loanData.status == 200) {
        this.isUpdate = true;
        this.amount = loanData.data.amount;
        this.loanid = loanData.data.id;
        this.imageUrl = this.getImageUrl(loanData.data.image_path);
      }
    },

    getImageUrl(path) {
      if (path) {
        const baseUrl = "http://localhost:8050/";
        return baseUrl.concat("", path);
      } else {
        return;
      }
    },

    async imageUploaded(file) {
      var base64String;
      var reader = new FileReader();

      reader.onload = function () {
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

        this.base64Image = base64String;
      };
      reader.readAsDataURL(file);
    },
      
    onFileChange(payload) {
      this.imageUploaded(payload);
      const file = payload; // in case vuetify file input
      if (file) {
        this.imageUrl = URL.createObjectURL(file);
        // URL.revokeObjectURL(file); // free memory
      } else {
        this.imageUrl = null;
      }
    },
    async saveLoanDetails() {
      var img_url = await convertBase64(this.image);
      this.loading = true;
   
      await this.$axios
        .$post(
          `/loans`,
          {
            user_id: this.user_id,
            name: this.name,
            amount: this.amount,
            image: img_url,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          this.loading = false;
        
      if (res.status == 200) {
        this.confirmaionSnackbar = true;
        this.responsesuccessMsg = res.message;
        this.isUpdate = true;
      } else {
         this.errorSnackBar = true;
         this.responseErrorMsg = res.message;
      }
                    })
                    .catch((error) => {
                        this.error = true;
                       
                    }).finally(() => {
                        this.loading =  false
                    });
      //   ;
      //    if (res.status == 200) {
      //   this.confirmaionSnackbar = true;
      //   this.responsesuccessMsg = res.message;
      // } else {
      //    this.errorSnackBar = true;
      //    this.responseErrorMsg = res.message;
      // }
    },

    async UpdateLoanDetails() {
      this.loading = true;
      
      if (this.image) {
        var img_url = await convertBase64(this.image);
      }
      await this.$axios.$put(
        `/loans/${this.loanid}`,
        {
          user_id: this.user_id,
          name: this.name,
          amount: this.amount,
          image: img_url ? img_url : null,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
          this.loading = false;
        
      if (res.status == 200) {
        this.confirmaionSnackbar = true;
        this.responsesuccessMsg = res.message;
        this.isUpdate = true;
      } else {
         this.errorSnackBar = true;
         this.responseErrorMsg = res.message;
      }
                    })
                    .catch((error) => {
                        this.error = true;
                       
                    }).finally(() => {
                        this.loading =  false
                    });
      
    
    },
  },
};
</script>

