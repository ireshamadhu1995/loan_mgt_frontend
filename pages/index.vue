<template>
  <v-dialog v-model="dialog" persistent max-width="40%" min-width="360px">
    <div>
      <v-card class="px-4" min-height="550px" color="light-blue lighten-5">
        <v-row align="center" justify="center">
          <v-col cols="12" class="mt-3">
            <span><h3>Bank Loan Management System</h3></span>
          </v-col>
          <v-col cols="12">
            <v-tabs
              v-model="tab"
              show-arrows
              background-color="blue lighten-4"
              icons-and-text
              grow
            >
              <v-tabs-slider color="purple darken-4"></v-tabs-slider>
              <v-tab v-for="i in tabs" :key="i">
                <v-icon large>{{ i.icon }}</v-icon>
                <div class="caption py-1">{{ i.name }}</div>
              </v-tab>
              <v-tab-item>
                <v-card class="px-4" color="light-blue lighten-5">
                  <v-card-text>
                    <v-form
                      ref="loginForm"
                      v-model="validLogin"
                      lazy-validation
                      class="mt-8"
                    >
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="loginEmail"
                            :rules="loginEmailRules"
                            label="E-mail"
                            required
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="loginPassword"
                            dense
                            outlined
                            :append-icon="show1 ? 'eye' : 'eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Password"
                            hint="At least 8 characters"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col
                          class="d-flex"
                          cols="12"
                          sm="3"
                          xsm="12"
                          align-end
                        >
                          <v-btn
                            dark
                            block
                            color="blue"
                            @click="userLogin"
                            outlined
                          >
                            Login
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card class="px-4" color="light-blue lighten-5">
                  <v-card-text>
                    <v-form ref="registerForm" v-model="valid" lazy-validation>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="fname"
                            :rules="[rules.required]"
                            label="Name"
                            maxlength="20"
                            required
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            required
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            outlined
                            dense
                            v-model="password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Password"
                            hint="At least 8 characters"
                            counter
                            @click:append="show1 = !show1"
                          ></v-text-field>
                        </v-col>

                        <v-spacer></v-spacer>
                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                          <v-btn dark block color="blue" @click="register()"
                            >Register</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-card>
      <!-- <v-row v-if="loading">
        <v-col>
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
      </v-row> -->
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
  </v-dialog>
</template>

<script>
import jwt_decode from "jwt-decode";
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
export default {
  layout: "plain",
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
  },

  async mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      console.log("res", this.$auth.loggedIn);
      if (this.$auth.loggedIn == true) {
        var token = this.$auth.strategy.token.get().replace("Bearer ", "");
        const userData = jwt_decode(token);
        // this.is_admin = userData.is_admin;
        if (userData.is_admin == 1) {
          this.$router.replace("view-clients");
        } else {
          this.$router.replace("loan-overview");
        }
      } else {
        return;
      }
    },
    async userLogin() {
      if (!this.validLogin) return;
      try {
        this.loading = true;
        let response = await this.$auth.loginWith("local", {
          data: {
            email_address: this.loginEmail,
            password: this.loginPassword,
          },
        });

        if (response.data.status == 200) {
          this.loading = false;
         
          this.getUserData();
        } else {
          this.loading = false;
         
          return;
        }
      } catch (err) {
        this.loading = false;
      
      }
    },

    async register() {
      if (!this.valid) return;
      this.encrypt_password = bcrypt.hashSync(this.password, salt);
      

      let that = this;
      this.loading = true;

       const res= await this.$axios
        .$post(
          `/users`,
          {
            name: this.fname,
            email: this.email,
            password: this.encrypt_password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if(res.status == 200){
           this.loading = false;
            this.confirmaionSnackbar = true;
            this.responsesuccessMsg = res.message;
            window.setTimeout(function () {
              location.reload();
            }, 1000);
        } else {
           this.loading = false;
            this.errorSnackBar = true;
            this.responseErrorMsg = res.message;
          }
       
     

     
    },

    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  data: () => ({
    validLogin: false,
    dialog: true,
    loading: false,
    tab: 0,
    loading: false,
    validationErrorMessage: "",
    confirmaionSnackbar: false,
    validationErrorSnackbar: false,
    errorSnackBar: false,
    responsesuccessMsg: "",
    responseErrorMsg: "",
    tabs: [
      { name: "Login", icon: "mdi-login" },
      { name: "Register", icon: "mdi-account-plus" },
    ],
    valid: true,

    fname: "",
    email: "",
    password: "",
    encrypt_password: "",
    verify: "",
    loginPassword: "",
    encrypt_loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    emailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],

    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
    },
  }),
};
</script>
