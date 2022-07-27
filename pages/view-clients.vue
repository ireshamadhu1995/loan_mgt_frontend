<template>
<div>
 
     <v-row v-if="isLoadingData">
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
     <v-row v-else>
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
        <v-col cols="10" class="mt-10">
          <h1>Loan Details</h1>
          <p>View Loan Details</p>
        </v-col>
        <v-spacer></v-spacer>
         <v-btn color="blue" dark class="mt-12"
         @click="logout()">
      Logout
    </v-btn>
      </v-row>
    <v-card-title>
     
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-dialog v-model="viewImageDialog" width="400px">
      <v-card height="400px">
        <v-row>
          <v-col cols="10">
          </v-col>
          <v-col cols="1">
  <v-btn flat icon color="primary" @click="viewImageDialog = !viewImageDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          </v-col>
        
        </v-row>
        <v-row align="center" justify="center">
 <img :src="viewImageScr" alt="" width="350px" height="350px"/>
        </v-row>
       
      </v-card>
    </v-dialog>
    <v-data-table :headers="headers" :items="desserts" :search="search">
      <template #item="{ item }">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.amount }}</td>
          <td>
            <template>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on">
                    <v-icon small @click="viewImage(item)"> mdi-eye-outline </v-icon>
                  </v-btn>
                </template>
                <span>View Image</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-bind="attrs" v-on="on">
                    <v-icon small @click="remove(item.id)">
                      mdi-trash-can
                    </v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </template>

            <!--Edit pack details -->
            <!-- <template>
                    <v-row justify="center">
                      <v-dialog
                        :retain-focus="false"
                        v-model="editDialog"
                        persistent
                        max-width="800px"
                      >
                        <v-card class="pa-2 mb-2">
                        
                          <v-card-title>
                            <span class="headline">
                              <v-icon
                                style="backgroundColor:rgba(26, 187, 156, 0.1; borderRadius:50%"
                                size="60px"
                                color="#1abb9c"
                              >
                                mdi-pencil-box
                              </v-icon>
                              Edit Rate Plan Promo Campaigns Details
                            </span>
                          </v-card-title>
                          <v-card-text>
                            <v-form ref="form" v-model="isEditValid">
                              <v-container>
                                <h3>Rate Plan Promo Campaigns Details</h3>
                                <v-divider></v-divider>
                                <v-row class="pt-4">
                                  <v-col cols="6">
                                    <v-text-field
                                      dense
                                      outlined
                                      label="Header*"
                                      v-model="editheader"
                                      :rules="[rules.required]"
                                      required
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="6">
                                    <v-text-field
                                      dense
                                      outlined
                                      label="Main Header*"
                                      v-model="editmainHeader"
                                      :rules="[rules.required]"
                                      required
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="6">
                                    <v-textarea
                                      outlined
                                      label="More Details*"
                                      v-model="edit_more_details"
                                      :rules="[rules.required]"
                                    ></v-textarea>
                                  </v-col>
                                  <v-col cols="6">
                                    <v-text-field
                                      dense
                                      outlined
                                      label="Rate Plan ID*"
                                      v-model="edit_ratePlanId"
                                      required
                                      min="1"
                                      type="number"
                                      :rules="[rules.required, rules.orderRule]"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="6">
                                    <v-switch v-model="edit_switch1"></v-switch>
                                  </v-col>  <v-col cols="6">
                                    <v-switch v-model="edit_is_guest_user"></v-switch>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col>
                                    <v-flex
                                      class="d-flex justify-end space-between"
                                    >
                                      <v-btn
                                        elevation="0"
                                        :disabled="!isEditValid"
                                        color="#279c7f"
                                        @click="saveEditPromoCampDetails()"
                                      >
                                        <v-icon>mdi-plus-thick</v-icon>
                                        Update
                                      </v-btn>
                                      <v-btn
                                        elevation="0"
                                        @click="editDialog = false"
                                      >
                                        Cancel
                                      </v-btn>
                                    </v-flex>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-form>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>
                  </template> -->

            <!-- old content -->
            <template>
              <v-dialog
                :retain-focus="false"
                v-model="deleteDialog"
                persistent
                max-width="600px"
              >
                <v-card>
                  <v-card-title>
                    <span class="headline">
                      Are you sure you want to delete this record?
                    </span>
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="red darken-1"
                      text
                      @click="
                        deleteBrand(deleteItem.code);
                        deleteDialog = false;
                      "
                    >
                      Delete
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteDialog = false"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </td>
        </tr>
      </template>
    </v-data-table>
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
export default {
  data() {
    return {
      validationErrorMessage: "",
      confirmaionSnackbar: false,
      validationErrorSnackbar: false,
      errorSnackBar: false,
      responsesuccessMsg: "",
      responseErrorMsg: "",
      isLoadingData: true,
      deleteDialog: false,
      deleteItem: [],
      search: "",
      page:1,
      limit:10,
      viewImageDialog: false,
      viewImageScr: null,
      headers: [
        { text: "Name", value: "name" },
        { text: "Amount (Rs.)", value: "amount" },
        {
          text: "Action",
          value: "action",
          divider: true,
        },
      ],
    desserts: [],
    };
  },
  async mounted() {
    this.getAllRecords();
  },

  methods: {

    viewImage(item){
      this.viewImageDialog = true;
    if (item.image_path) {
        const baseUrl = "http://localhost:8050/";
        this.viewImageScr = baseUrl.concat("", item.image_path);
        // window.open(baseUrl.concat("", item.image_path), '_blank');
      } else {
        return;
      }


    },

     logout(){
      this.$auth.logout();
      console.log(this.$auth.loggedIn);
      window.location.reload(true);
    },
    remove(code) {
      this.deleteItem.code = code;
      this.deleteDialog = true;
    },

    async deleteBrand(id) {
      const res = await this.$axios
        .$delete(`/loans/delete/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
 
        if(res.status == 200){
         
          this.responsesuccessMsg = res.message;
          this.confirmaionSnackbar = true;
          this.getAllRecords();
        } else {
          this.responsesuccessMsg = res.message;
          this.errorSnackBar = true;
        }
    },

    async getAllRecords(){
       const response = await this.$axios.$get(
          `/loans`,
          {
              headers: {
                "Content-Type": "application/json",
              },
          }
        );
        if(response.status == 200){
          this.desserts = response.data.data;
          this.isLoadingData = false;
          this.responsesuccessMsg = response.data.message;
        } else {
          this.desserts = [];
        }
    }
  },
};
</script>