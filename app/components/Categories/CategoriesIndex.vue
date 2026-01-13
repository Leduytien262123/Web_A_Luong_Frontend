<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { useProductStore } from "~/stores/product";

const productStore = useProductStore();
const gtm = useGtm();
const route = useRoute();
const props = defineProps({
  productCategoryList: {
    type: Array,
    default: [],
  },
});

const productCategories = props.productCategoryList;
// console.log("aaaaaaaa", productCategories);

function getCheapestProduct(variants) {
  if (!variants || !variants.length) return null;
  return variants.reduce((cheapest, current) => {
    const currentPrice = current.price_sale || current.price || Infinity;
    const cheapestPrice = cheapest.price_sale || cheapest.price || Infinity;
    return currentPrice < cheapestPrice ? current : cheapest;
  }, {});
}

// const cheapestProducts = computed(() => {
//   return productCategories.map((category) => {
//     if (!category?.products || !category.products.length) return null;

//     return category.products.map((product) => {
//       const variants = product?.productVariant;
//       if (!variants || !variants.length) return null;

//       // Tìm phần tử có giá nhỏ nhất
//       return variants.reduce((cheapest, current) => {
//         const currentPrice = current.price_sale || current.price || Infinity;
//         const cheapestPrice = cheapest.price_sale || cheapest.price || Infinity;
//         return currentPrice < cheapestPrice ? current : cheapest;
//       }, {});
//     });
//   });
// });

// console.log("cheapestProducts", cheapestProducts.value);

const formatPrice = (price) => {
  return price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "";
};

const handleProductClick = (product) => {
  productStore.addProductToSeen(product);
  gtm?.dataLayer()?.push({ ecommerce: null });
  gtm?.dataLayer()?.push({
    event: "select_item",
    ecommerce: {
      item_list_id: product?.id || "",
      item_list_name: product?.name || "",
      items: [product],
    },
  });
  navigateTo(`sanpham/${product.slug}`);
};

const rawCategories = productCategories?.map((cat) => cat?.category);

const categoriesMap = rawCategories.reduce((acc, item) => {
  acc[item.id] = { ...item, options: [] };
  return acc;
}, {});

Object.values(categoriesMap).forEach((category) => {
  if (
    !isObjectNullOrEmpty(category.parent_id) &&
    categoriesMap[category.parent_id]
  ) {
    categoriesMap[category.parent_id].options.push(category);
  }
});

let visibleCategories = Object.values(categoriesMap).filter(
  (category) =>
    isObjectNullOrEmpty(category.parent_id) && category.visible_nav === 1
);

visibleCategories.forEach((category) => {
  category.options = category.options.filter(
    (child) => child.visible_nav === 1
  );
  category.options.forEach((child) => {
    child.options = Object.values(categoriesMap).filter(
      (subCategory) =>
        subCategory.parent_id === child.id && subCategory.visible_nav === 1
    );
    child.options.sort((c1, c2) => c1.position - c2.position);
  });
  category.options.sort((c1, c2) => c1.position - c2.position);
});

visibleCategories.sort((c1, c2) => c1.position - c2.position);

const validateRoutePath = () => {
  const categoryPathArr = route.path.split("/").filter(Boolean);
  const allowedPaths = [
    "tin-tuc",
    "search",
    "sanpham",
    "dat-hang",
    "chinh-sach-thanh-toan",
    "chinh-sach-doi-tra",
    "huong-dan-mua-hang",
    "kiem-tra-thiet-bi",
  ];
  if (allowedPaths.includes(categoryPathArr[0])) {
    return;
  }
  let currentCategories = visibleCategories;
  for (let i = 0; i < categoryPathArr.length; i++) {
    const category = currentCategories.find(
      (cat) => cat.slug === categoryPathArr[i]
    );
    if (!category) {
      navigateTo("/");
      return;
    }
    currentCategories = category.options;
  }
};

validateRoutePath();

const constructCategoryPath = (category) => {
  let path = `/${category.slug}`;

  const findParent = (categoryId, categories) => {
    for (const cat of categories) {
      if (cat.options?.some((option) => option.id === categoryId)) {
        return cat;
      }
      if (cat.options) {
        const nestedParent = findParent(categoryId, cat.options);
        if (nestedParent) return nestedParent;
      }
    }
    return null;
  };

  let parent = findParent(category.id, visibleCategories);

  while (parent) {
    path = `/${parent.slug}${path}`;
    parent = findParent(parent.id, visibleCategories);
  }

  return path;
};
</script>

<template>
  <div>
    <div class="mt-20 text-2xl lg:hidden text-title text-center font-medium">
      SIM du lịch phổ biến
    </div>
    <div
      v-for="(item, index) in productCategories"
      :key="index"
      class="lg:my-[100px] my-[30px]"
    >
      <div
        v-if="item?.category?.visible_home === 1 && item.products.length > 0"
        class=""
      >
        <!-- && !(
            item.category?.parent_id === '' || item.category?.parent_id === null
          ) -->
        <div class="flex justify-between">
          <h3 class="lg:text-[28px] text-xl text-title font-[600]">
            {{ item?.category?.name }}
          </h3>
          <div
            @click="navigateTo(constructCategoryPath(item?.category))"
            class="flex items-center cursor-pointer"
          >
            <span class="text-primary text-base mr-1 font-medium"
              >Xem tất cả</span
            >
            <ViewAllCategory />
          </div>
        </div>
        <div
          v-if="item?.products && item?.products.length > 0"
          class="lg:mt-10 mt-3"
        >
          <Swiper
            :slides-per-view="1.5"
            :grid="{ rows: 2, fill: 'row' }"
            :space-between="16"
            :breakpoints="{
              450: {
                slidesPerView: 2,
                grid: { rows: 1, fill: 'row' },
                spaceBetween: 20,
              },
              700: {
                slidesPerView: 3,
                grid: { rows: 1, fill: 'row' },
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                grid: { rows: 1, fill: 'row' },
                spaceBetween: 30,
              },
            }"
          >
            <SwiperSlide v-for="item in item?.products" :key="item">
              <div
                v-if="item.productVariant && item.productVariant.length > 0"
                @click="handleProductClick(item)"
                class="cursor-pointer"
              >
                <div
                  class="max-w-[285px] 2xl:max-w-full 2xl:max-h-full max-h-[285px] relative"
                >
                  <img
                    :src="item.thumb_image?.[0]?.src || '/img/empty.jpg'"
                    :alt="item.thumb_image?.[0]?.alt || 'No-image'"
                    class="w-full h-full object-cover rounded-tl-3xl rounded-tr-3xl"
                  />
                  <div
                    v-if="item.type"
                    class="absolute top-3 left-3 bg-white px-2 py-1 rounded-lg text-sm font-light"
                  >
                    {{ item.type }}
                  </div>

                  <div
                    v-if="
                      getCheapestProduct(item.productVariant)?.price_sale &&
                      getCheapestProduct(item.productVariant)?.price_sale <
                        getCheapestProduct(item.productVariant)?.price &&
                      Math.floor(
                        (1 -
                          getCheapestProduct(item.productVariant)?.price_sale /
                            getCheapestProduct(item.productVariant)?.price) *
                          100
                      ) > 2
                    "
                    class="absolute top-3 right-3 bg-[#FF6C1C] text-white px-2 py-1 rounded-lg text-sm font-light"
                  >
                    Sale off
                    {{
                      Math.floor(
                        (1 -
                          getCheapestProduct(item.productVariant)?.price_sale /
                            getCheapestProduct(item.productVariant)?.price) *
                          100
                      )
                    }}%
                  </div>
                </div>

                <div class="mt-3">
                  <div>
                    <div class="text-title text-base font-medium">
                      {{
                        getCheapestProduct(item.productVariant)?.name ||
                        item.name
                      }}
                    </div>
                    <div class="text-lg font-medium">
                      <span
                        v-if="
                          getCheapestProduct(item.productVariant)?.price_sale &&
                          getCheapestProduct(item.productVariant)
                            ?.price_sale !== 0
                        "
                        class="text-[#B1B1B1] mb-1 mr-4 line-through"
                      >
                        {{
                          formatPrice(
                            getCheapestProduct(item.productVariant)?.price
                          )
                        }}
                      </span>
                      <span
                        v-if="
                          getCheapestProduct(item.productVariant)?.price_sale &&
                          getCheapestProduct(item.productVariant)
                            ?.price_sale !== 0
                        "
                        class="text-primary"
                      >
                        {{
                          formatPrice(
                            getCheapestProduct(item.productVariant)?.price_sale
                          ) ||
                          formatPrice(
                            getCheapestProduct(item.productVariant)?.price
                          )
                        }}
                      </span>

                      <span v-else class="text-primary">
                        {{
                          formatPrice(
                            getCheapestProduct(item.productVariant)?.price
                          )
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  </div>
</template>
