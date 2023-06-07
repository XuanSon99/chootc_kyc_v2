<template>
  <main>
    <section>
      <div v-if="!tab">
        <div class="head">
          <span>Thông tin cá nhân</span>
        </div>
        <div class="paddin">
          <v-text-field label="Họ và tên" placeholder="Vui lòng nhập đủ họ tên" outlined clearable v-model="name"
            prepend-inner-icon="mdi-account"></v-text-field>
          <v-text-field label="Số điện thoại" placeholder="Số điện thoại" type="number" outlined v-model="phone" clearable
            prepend-inner-icon="mdi-phone "></v-text-field>
          <div class="center">
            <div class="btn-all" @click="firstStep">Tiếp tục</div>
          </div>
        </div>
      </div>
      <div v-if="tab == 1">
        <div class="head">
          <v-btn icon color="white" @click="tab = 0">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span>Ảnh mặt trước CCCD</span>
        </div>
        <div class="paddin">
          <img :src="front_preview" class="image-pre" alt="">
          <image-uploader :preview="true" :className="['dp-none']" capture="camera" outputFormat="blob" :maxWidth="800"
            :maxHeight="800" :quality="0.8" id="front" @input="inputImageFront">
            <label for="front" slot="upload-label" class="btn-all mt-5">
              <span v-if="!front">Bắt đầu</span>
              <span v-else>Chụp lại</span>
            </label>
          </image-uploader>
          <div class="relative">
            <div class="btn-all outline" :class="{ disabled: !front }" @click="tab = 2">Tiếp tục</div>
          </div>
        </div>
      </div>
      <div v-if="tab == 2">
        <div class="head">
          <v-btn icon color="white" @click="tab = 1">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span>Ảnh mặt sau CCCD</span>
        </div>
        <div class="paddin">
          <img :src="back_preview" class="image-pre" alt="">
          <image-uploader :preview="true" :className="['dp-none']" capture="camera" outputFormat="blob" :maxWidth="800"
            :maxHeight="800" :quality="0.8" id="back" @input="inputImageBack">
            <label for="back" slot="upload-label" class="btn-all mt-5">
              <span v-if="!back">Bắt đầu</span>
              <span v-else>Chụp lại</span>
            </label>
          </image-uploader>
          <div class="relative">
            <div class="btn-all outline" :class="{ disabled: !back }" @click="tab = 3">Tiếp tục</div>
          </div>
        </div>
      </div>
      <div v-if="tab == 3">
        <div class="head">
          <v-btn icon color="white" @click="tab = 2; video = ''">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span>Video chân dung (5s)</span>
        </div>
        <div class="paddin">
          <img src="img/portrait.png" v-if="!video" class="image-pre" alt="">
          <video id="video-preview" controls :class="{ 'dp-none': !video }" autoplay></video>
          <label for="video" class="btn-all mt-5">
            <span v-if="!video">Bắt đầu</span>
            <span v-else>Quay lại</span>
          </label>
          <input type="file" id="video" class="dp-none" @change="inputVideo" accept="video/*" capture="camcorder">
          <div class="relative">
            <div class="btn-all outline" :class="{ disabled: !video }" @click="confirm" v-if="!loading">Xác nhận</div>
            <div class="btn-all disabled outline" v-else>Loading...</div>
          </div>
        </div>
      </div>
      <div v-if="tab == 4" class="noti">
        <div class="paddin">
          <img src="/img/success.png" alt="" />
          <p>
            Chúc mừng bạn đã gửi yêu cầu KYC thành công. Vui lòng liên hệ Admin
            để được thông qua!
          </p>
        </div>
      </div>
      <div v-if="tab == 5" class="noti">
        <div class="paddin">
          <img src="/img/error.png" alt="" />
          <p>
            Yêu cầu KYC đã được gửi trước đó. Vui lòng liên hệ Admin để được
            thông qua!
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import ImageUploader from 'vue-image-upload-resize'
export default {
  components: {
    ImageUploader
  },
  data() {
    return {
      tab: 0,
      name: "",
      phone: "",
      front: "",
      back: "",
      video: "",
      ip: "",
      loading: false,
      front_preview: "/img/front.png",
      back_preview: "/img/back.png",
    }
  },
  computed: {
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      }
      return false
    }
  },
  mounted() {
    this.getIP()
    if (!this.isMobile) {
      this.$router.push("/error")
    }
  },
  methods: {
    inputImageFront(output) {
      this.front = output;
      this.front_preview = URL.createObjectURL(output)
    },
    inputImageBack(output) {
      this.back = output;
      this.back_preview = URL.createObjectURL(output)
    },
    inputVideo(e) {
      var files = e.target.files;
      this.video = files[0]
      let video = document.getElementById('video-preview');
      let reader = new FileReader();

      reader.readAsDataURL(this.video);
      reader.addEventListener('load', function () {
        video.src = reader.result;
      });
    },
    confirm() {
      this.loading = true;

      const chat_id = this.$route.params.id.split("-")[1];
      const username = this.$route.params.id.split("-")[0];

      var formData = new FormData();
      formData.append("chat_id", chat_id);
      formData.append("username", username);
      formData.append("name", this.name);
      formData.append("phone", this.phone);
      formData.append("ip_address", this.ip);
      formData.append("front_photo", this.front);
      formData.append("back_photo", this.back);
      formData.append("portrait_photo", this.front);
      formData.append("portrait_video", this.video);

      this.CallAPI(
        "post",
        "kyc",
        formData,
        (res) => {
          this.tab = 4;
        },
        (err) => {
          this.tab = 5;
        }
      );
    },
    firstStep() {
      if (!this.name || !this.phone) {
        this.$toast.error("Vui lòng nhập đủ thông tin!");
        return;
      }
      if (!this.validatePhone(this.phone)) {
        this.$toast.error("Số điện thoại không chính xác!");
        return;
      }
      if (!this.ip) {
        this.$toast.error("Hãy cho phép Browser truy cập định vị!");
        return;
      }
      this.tab = 1;
    },
    validatePhone(phone) {
      var re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
      return re.test(phone);
    },
    getIP() {
      axios.get("https://www.cloudflare.com/cdn-cgi/trace").then((res) => {
        const data = res.data
          .trim()
          .split("\n")
          .reduce(function (obj, pair) {
            pair = pair.split("=");
            return (obj[pair[0]] = pair[1]), obj;
          }, {});
        this.ip = data.ip;
      });
    },
  },

};
</script>