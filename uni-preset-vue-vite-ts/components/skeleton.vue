<template>
	<view class="skeleton" v-if="loading">
		<!-- Banner骨架屏 -->
		<view v-if="banner" class="skeleton-banner"></view>
		
		<!-- 标题骨架屏 -->
		<view v-if="title" class="skeleton-title"></view>
		
		<!-- 网格骨架屏 -->
		<view v-if="grid" class="skeleton-grid">
			<view class="skeleton-grid-item" v-for="(item, index) in 9" :key="index"></view>
		</view>
		
		<!-- 行骨架屏 -->
		<view v-for="(item, index) in rows" :key="index" class="skeleton-row">
			<view class="skeleton-row-content">
				<view class="skeleton-row-avatar"></view>
				<view class="skeleton-row-lines">
					<view class="skeleton-row-line-top"></view>
					<view class="skeleton-row-line-middle"></view>
					<view class="skeleton-row-line-bottom"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'skeleton',
		props: {
			rows: {
				type: Number,
				default: 0
			},
			loading: {
				type: Boolean,
				default: false
			},
			grid: {
				type: Boolean,
				default: false
			},
			title: {
				type: Boolean,
				default: false
			},
			banner: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss">
	@keyframes shimmer {
		0% {
			background-position: -468px 0;
		}
		100% {
			background-position: 468px 0;
		}
	}
	
	.skeleton {
		padding: 20rpx;
		
		.skeleton-banner {
			width: 100%;
			height: 300rpx;
			margin-bottom: 20rpx;
			border-radius: 8rpx;
			background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
			background-size: 400% 100%;
			animation: shimmer 1.4s linear infinite;
		}
		
		.skeleton-title {
			width: 50%;
			height: 60rpx;
			margin-bottom: 30rpx;
			border-radius: 8rpx;
			background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
			background-size: 400% 100%;
			animation: shimmer 1.4s linear infinite;
		}
		
		.skeleton-grid {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 40rpx;
			
			.skeleton-grid-item {
				width: 31%;
				height: 180rpx;
				margin-right: 3%;
				margin-bottom: 20rpx;
				border-radius: 8rpx;
				background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
				background-size: 400% 100%;
				animation: shimmer 1.4s linear infinite;
				
				&:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
		
		.skeleton-row {
			margin-bottom: 30rpx;
			
			.skeleton-row-content {
				display: flex;
				align-items: flex-start;
				
				.skeleton-row-avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
					background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
					background-size: 400% 100%;
					animation: shimmer 1.4s linear infinite;
				}
				
				.skeleton-row-lines {
					flex: 1;
					display: flex;
					flex-direction: column;
					
					.skeleton-row-line-top {
						width: 90%;
						height: 32rpx;
						margin-bottom: 16rpx;
						border-radius: 6rpx;
						background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
						background-size: 400% 100%;
						animation: shimmer 1.4s linear infinite;
					}
					
					.skeleton-row-line-middle {
						width: 70%;
						height: 32rpx;
						margin-bottom: 16rpx;
						border-radius: 6rpx;
						background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
						background-size: 400% 100%;
						animation: shimmer 1.4s linear infinite;
					}
					
					.skeleton-row-line-bottom {
						width: 50%;
						height: 32rpx;
						border-radius: 6rpx;
						background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
						background-size: 400% 100%;
						animation: shimmer 1.4s linear infinite;
					}
				}
			}
		}
	}
</style> 